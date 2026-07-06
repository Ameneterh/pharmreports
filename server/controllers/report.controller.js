import User from "../models/user.model.js";
import Report from "../models/report.model.js";
import { getDeadline, isSubmissionAllowed } from "../utils/reportDeadline.js";
import dayjs from "../utils/dayjs.js";
import { generateExcel } from "../utils/generateExcel.js";
import { generateWord } from "../utils/generateWord.js";

// create contact message

export const sendReport = async (req, res) => {
  try {
    const {
      workStation,
      dutyType,
      timeOfDuty,
      reportStartDate,
      reportEndDate,
      dutyDateTime,
      dutiesDone,
      challenges,
      observations,
      interventions,
      outOfStock,
      remarks,
      reporter,
    } = req.body;

    // Validate required fields
    if (
      !workStation ||
      !dutyType ||
      !timeOfDuty ||
      !dutyDateTime ||
      !dutiesDone ||
      !challenges ||
      !observations ||
      !interventions ||
      !outOfStock
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing!",
      });
    }

    // Map your fields to deadline logic
    const reportDate = dutyDateTime;
    const shift = timeOfDuty;

    // Generate deadline
    const deadline = getDeadline(reportDate, shift);

    // OPTIONAL: Block late submissions at creation time
    const now = dayjs().tz("Africa/Lagos");

    if (now.isAfter(deadline)) {
      // Allow admin override
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Submission window has closed for this report.",
        });
      }
    }

    // Get week start (your existing logic)
    const today = new Date();
    const day = today.getDay();

    const startOfCycle = new Date(today);
    startOfCycle.setDate(today.getDate() - day);
    startOfCycle.setHours(0, 0, 0, 0);

    // Create report
    const report = await Report.create({
      workStation,
      dutyType,
      timeOfDuty,
      reportStartDate,
      reportEndDate,
      dutyDateTime,
      dutiesDone,
      challenges,
      observations,
      interventions,
      outOfStock,
      remarks,
      reporter,
      reportingWeekStart: startOfCycle,

      // important
      submissionDeadline: deadline.toISOString(),

      // optional future features
      isManuallyOpened: false,
    });

    res.status(201).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// export const sendReport = async (req, res) => {
//   try {
//     const {
//       workStation,
//       dutyType,
//       timeOfDuty,
//       dutyDateTime,
//       dutiesDone,
//       challenges,
//       observations,
//       interventions,
//       outOfStock,
//       remarks,
//       reporter,
//     } = req.body;

//     const deadline = getDeadline(reportDate, shift);

//     // Add validation for required fields
//     if (
//       !workStation ||
//       !dutyType ||
//       !timeOfDuty ||
//       !dutyDateTime ||
//       !dutiesDone ||
//       !challenges ||
//       !observations ||
//       !interventions ||
//       !outOfStock
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields missing!",
//       });
//     }

//     // get week start
//     const now = new Date();
//     const day = now.getDay();
//     // Sunday = 0, Monday = 1 ... Saturday = 6
//     const startOfCycle = new Date(now);
//     // Move back to the previous Sunday
//     startOfCycle.setDate(now.getDate() - day);
//     startOfCycle.setHours(0, 0, 0, 0);

//     const report = await Report.create({
//       workStation,
//       dutyType,
//       timeOfDuty,
//       dutyDateTime,
//       dutiesDone,
//       challenges,
//       observations,
//       interventions,
//       outOfStock,
//       remarks,
//       reporter,
//       reportingWeekStart: startOfCycle,
//       submissionDeadline: deadline.toISOString(),
//     });

//     res.status(201).json({
//       success: true,
//       report: report,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const sendComment = async (req, res) => {
  try {
    const { comment, reportId, commentBy } = req.body;

    // Add validation for required fields
    if (!comment || !reportId || !commentBy) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing!",
      });
    }

    const reportExists = await Report.findById(reportId);

    if (!reportExists) {
      return res.status(400).json({
        success: false,
        message: "Report not found!",
      });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { $push: { comments: { commentBy, comment } } },
      {
        new: true,
      },
    );

    res.status(201).json({
      success: true,
      report: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all reports
export const getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const now = new Date();

    // Determine start date
    let start = startDate ? new Date(startDate) : new Date(now);

    if (!startDate) {
      // Default to Sunday of current reporting week
      const day = now.getDay(); // Sunday = 0

      start.setDate(now.getDate() - day);
    }

    // Start from midnight
    start.setHours(0, 0, 0, 0);

    // Determine end date
    let end = endDate ? new Date(endDate) : new Date(now);

    // End of selected day
    end.setHours(23, 59, 59, 999);

    const reports = await Report.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("reporter")
      .populate("comments.commentBy")
      .sort({ createdAt: -1 });

    // Remove reports where reporter role didn't match
    const filteredReports = reports.filter((report) => report.reporter);

    const totalReports = await Report.countDocuments();

    // Reports by role
    const reportsByRole = await Report.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "reporter",
          foreignField: "_id",
          as: "reporter",
        },
      },
      {
        $unwind: "$reporter",
      },
      {
        $match: {
          "reporter.role": {
            $in: ["pharmacist", "pharmtech"],
          },
        },
      },
      {
        $group: {
          _id: "$reporter.role",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const formattedReportsByRole = reportsByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: "Reports fetched successfully",

      period: {
        start,
        end,
      },

      reports: filteredReports,

      totalReports,

      reportsByRole: formattedReportsByRole,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getReports = async (req, res) => {
//   try {
//     // Get reports made by pharmacists and pharmtech
//     const reports = await Report.find({})
//       .populate({
//         path: "reporter",
//         match: {
//           role: { $in: ["pharmacist", "pharmtech"] },
//         },
//       })
//       .sort({ createdAt: -1 });

//     const totalReports = await Report.countDocuments();

//     // Remove reports where reporter did not match the role
//     const filteredReports = reports.filter((report) => report.reporter);

//     // get last month reports
//     const now = new Date();

//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate(),
//     );

//     const lastMonthReports = await Report.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });

//     // get last week reports
//     const lastWeekReports = await Report.find({
//       createdAt: {
//         $gte: filteredReports.reportingWeekStart,
//         $lte: now,
//       },
//     })
//       .populate({
//         path: "reporter",
//         match: {
//           role: { $in: ["pharmacist", "pharmtech"] },
//         },
//       })
//       .sort({ createdAt: -1 });

//     console.log(filteredReports);

//     // const oneWeekAgo = new Date();
//     // oneWeekAgo.setDate(now.getDate() - 7);

//     // const lastWeekReports = await Report.countDocuments({
//     //   createdAt: {
//     //     $gte: oneWeekAgo,
//     //     $lte: now,
//     //   },
//     // });

//     // Count reports by role
//     const reportsByRole = await Report.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "reporter",
//           foreignField: "_id",
//           as: "reporter",
//         },
//       },
//       {
//         $unwind: "$reporter",
//       },
//       {
//         $match: {
//           "reporter.role": {
//             $in: ["pharmacist", "pharmtech"],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$reporter.role",
//           count: {
//             $sum: 1,
//           },
//         },
//       },
//     ]);

//     const formattedReportsByRole = reportsByRole.reduce((acc, item) => {
//       acc[item._id] = item.count;
//       return acc;
//     }, {});

//     res.status(200).json({
//       success: true,
//       message: "Reports fetched successfully",
//       reports: filteredReports,
//       totalReports,
//       lastWeekReports,
//       lastMonthReports,
//       reportsByRole: formattedReportsByRole,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// generate reports summary

export const getWeeklySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const reports = await Report.find({
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    }).populate("reporter");

    const summary = {};

    reports.forEach((report) => {
      const id = report.reporter._id;

      if (!summary[id]) {
        summary[id] = {
          name: report.reporter.fullname,

          totalReports: 0,

          interventions: 0,
        };
      }

      summary[id].totalReports++;

      if (
        report.interventions &&
        !/^(nil|nill|none|n\/a|na|no|no intervention|no interventions|not applicable|-|0)$/i.test(
          report.interventions.trim(),
        ) &&
        report.interventions.toLowerCase() //.includes("interventions")
      ) {
        summary[id].interventions++;
      }
    });

    const formatted = Object.values(summary);

    const excel = await generateExcel(formatted, startDate, endDate);

    // const word = await generateWord(formatted);

    res.status(200).json({
      message: "Summary generated successfully!",

      data: formatted,

      files: {
        excel,

        // word,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get one invoice
export const getInvoice = async (req, res) => {
  const invoiceId = req.params.invoiceId;

  try {
    const invoice = await Invoice.findById(invoiceId)
      .populate("client")
      .populate("company")
      .populate("createdBy");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

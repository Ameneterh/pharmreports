import User from "../models/user.model.js";
import Update from "../models/update.model.js";
import { getDeadline, isSubmissionAllowed } from "../utils/reportDeadline.js";
import dayjs from "../utils/dayjs.js";

// send new notification
export const sendUpdate = async (req, res) => {
  try {
    const { title, content, remarks, updateBy } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing!",
      });
    }

    // Create report
    const update = await Update.create({
      title,
      content,
      remarks,
      updateBy,
      readBy: [],
    });

    res.status(201).json({
      success: true,
      update,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending update",
      error: error.message,
    });
  }
};

// get all notifications
export const getUpdates = async (req, res) => {
  try {
    const updates = await Update.find()
      .populate("updateBy")
      .populate("readBy.reader")
      .sort({ createdAt: -1 });

    const unreadCount = updates?.filter(
      (update) =>
        !update.readBy.some(
          (item) => item.reader._id.toString() === req.userId.toString(),
        ),
    ).length;

    res.json({
      success: true,
      message: "Updates fetched successfully",
      updates: {
        updates,
        unreadCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// mark notification as read
export const markUpdateRead = async (req, res) => {
  try {
    const userId = req.userId;

    const update = await Update.findOneAndUpdate(
      {
        _id: req.params.id,
        "readBy.reader": { $ne: userId }, // ✅ only if user not already in array
      },
      {
        $push: {
          readBy: {
            reader: userId,
            readAt: new Date(),
          },
        },
      },
      { new: true },
    );

    const existingUpdate = update || (await Update.findById(req.params.id));

    if (!existingUpdate) {
      return res.status(404).json({
        success: false,
        message: "Update not found",
      });
    }

    res.json({
      success: true,
      update: existingUpdate,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// mark all notifications as read
export const markAllRead = async (req, res) => {
  const userId = req.userId;

  const updates = await Update.find({
    "readBy.reader": {
      $ne: userId,
    },
  });

  for (const udpate of updates) {
    update.readBy.push({
      reader: userId,
    });

    await update.save();
  }

  res.json({
    success: true,
  });
};

// comment on notification
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

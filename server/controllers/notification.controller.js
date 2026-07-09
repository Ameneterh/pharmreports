import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { getDeadline, isSubmissionAllowed } from "../utils/reportDeadline.js";
import dayjs from "../utils/dayjs.js";

// send new notification
export const sendNotification = async (req, res) => {
  try {
    const { title, content, remarks, notificationBy } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing!",
      });
    }

    // Create report
    const notification = await Notification.create({
      title,
      content,
      remarks,
      notificationBy,
    });

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("notificationBy")
      .populate("readBy.reader")
      .sort({ createdAt: -1 });

    const unreadCount = notifications?.filter(
      (notification) =>
        !notification.readBy.some(
          (item) => item.reader._id.toString() === req.userId.toString(),
        ),
    ).length;

    res.json({
      success: true,
      message: "Notifications fetched successfully",
      notifications: {
        notifications,
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
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.userId;

    const notification = await Notification.findOneAndUpdate(
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

    // If null, it means:
    // - notification doesn't exist OR
    // - user already read it (which we want to ignore)

    const existingNotification =
      notification || (await Notification.findById(req.params.id));

    if (!existingNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification: existingNotification,
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

  const notifications = await Notification.find({
    "readBy.reader": {
      $ne: userId,
    },
  });

  for (const notification of notifications) {
    notification.readBy.push({
      reader: userId,
    });

    await notification.save();
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

import Invoice from "../models/invoice.model.js";
import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";

// create contact message
export const sendMessage = async (req, res) => {
  try {
    const { sender_name, sender_email, sender_phone, text } = req.body;

    // Add validation for required fields
    if (!sender_name || !sender_email || !sender_phone || !text) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const message = await Contact.create({
      sender_name,
      sender_email,
      sender_phone,
      text,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all messages
export const getMessages = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "architect") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view messages",
      });
    }
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    const totalMessages = await Contact.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    const lastMonthMessages = await Contact.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
      totalMessages,
      lastMonthMessages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const readMessage = async (req, res) => {
  const { status, readBy, messageId } = req.body;

  try {
    const message = await Contact.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const updatedMessage = await Contact.findByIdAndUpdate(
      messageId,
      { $set: { status, readBy } },
      {
        new: true,
        // runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Message read successfully",
      // message: message,
    });
  } catch (error) {
    console.error("Message Read Error:", error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to read message",
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

import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Generate PDF invoice and return as buffer
 */
const generateInvoicePDF = (booking, user) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // ===== Invoice Content =====
        doc.fontSize(20).text("Flight Booking Invoice", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Name: ${user.name}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Phone: ${user.phone}`);
        doc.text(`From: ${booking.fromPlace}`);
        doc.text(`To: ${booking.toPlace}`);
        doc.text(`Travel Date: ${booking.travelDate}`);
        doc.text(`Travel Time: ${booking.travelTime}`);
        doc.text(`Flight Type: ${booking.flightType}`);
        doc.text(`Amount Paid: ₹${booking.totalAmount}`);
        doc.moveDown();

        doc.text("Thank you for booking with us!", { align: "center" });

        doc.end();
    });
};

/**
 * Send booking confirmation email with invoice
 */
export const sendBookingEmailWithInvoice = async (booking, user) => {
    const pdfBuffer = await generateInvoicePDF(booking, user);

    const mailOptions = {
        from: `"Bookings Team" <${process.env.SMTP_FROM_NAME}>`,
        to: user.email,
        subject: "Your Flight Booking Confirmation",
        text: `Hello ${booking.name},\n\nYour flight booking has been confirmed. Please find the invoice attached.\n\nThanks,\nTeam`,
        attachments: [
            {
                filename: "invoice.pdf",
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};

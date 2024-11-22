import nodemailer from 'nodemailer'


async function sendEmail(to , subject , htmlContent) {
    try {
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure: false,
            auth:{
                user:'sahilthakur14691@gmail.com',
                pass:"lmqxtbbelawugrpm"
            }
        });

        const info = await transporter.sendMail({
            from:'sahilthakur14691@gmail.com',
            to,
            subject,
            html: htmlContent,
        });
        console.log('Email sent:', info.to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
    
}

export {sendEmail}
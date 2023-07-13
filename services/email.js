import nodeoutlook from 'nodejs-nodemailer-outlook'

export const myEmail = (reciever, subject, message) => {
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.senderEmail,
            pass: process.env.senderEmailPassword
        },
        from: process.env.senderEmail,
        to: reciever,
        subject,
        html: message,
        text: 'This is text version!',
        replyTo: 'receiverXXX@gmail.com',

        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }


    );
}
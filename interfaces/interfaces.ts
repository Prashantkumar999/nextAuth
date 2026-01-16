export default interface SendMailParams {
    email: string;
    emailType: "VERIFY" | "RESET";
    userId: string;
}



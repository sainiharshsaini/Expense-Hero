"use server";

import type { ReactNode } from "react";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

interface SendEmailParams {
	to: string | string[];
	subject: string;
	react: ReactNode;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
	if (!apiKey) {
		return { success: false, error: "Missing Resend API key" };
	}

	const resend = new Resend(apiKey);

	try {
		const response = await resend.emails.send({
			from: "Finance App <onboarding@resend.dev>",
			to,
			subject,
			react,
		});

		return { success: true, data: response };
	} catch (err) {
		return { success: false, error: err };
	}
}

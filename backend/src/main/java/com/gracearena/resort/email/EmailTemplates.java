package com.gracearena.resort.email;

import org.springframework.web.util.HtmlUtils;

/**
 * Hand-rolled HTML email chrome. Table-based and inline-styled on purpose — mail
 * clients still ignore most of a stylesheet.
 */
final class EmailTemplates {

	private static final String INK = "#0c0c0c";
	private static final String GOLD = "#c9a227";
	private static final String IVORY = "#faf7f0";
	private static final String BODY_TEXT = "#3a352c";
	private static final String MUTED = "#8a8272";

	private EmailTemplates() {
	}

	static String escape(String value) {
		return value == null ? "" : HtmlUtils.htmlEscape(value);
	}

	/** Wraps body markup in the branded shell. */
	static String layout(String heading, String bodyHtml) {
		return """
				<!doctype html>
				<html lang="en">
				<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
				<body style="margin:0;padding:0;background:%s;">
				  <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:%s;padding:32px 12px;">
				    <tr><td align="center">
				      <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e7dfd0;">
				        <tr>
				          <td style="background:%s;padding:28px 32px;text-align:center;">
				            <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:3px;color:#ffffff;text-transform:uppercase;">Grace&nbsp;Arena</div>
				            <div style="font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:6px;color:%s;text-transform:uppercase;margin-top:6px;">Resorts</div>
				          </td>
				        </tr>
				        <tr><td style="height:3px;background:%s;"></td></tr>
				        <tr>
				          <td style="padding:36px 32px 12px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:%s;">%s</td>
				        </tr>
				        <tr>
				          <td style="padding:0 32px 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:%s;">%s</td>
				        </tr>
				        <tr>
				          <td style="background:%s;padding:22px 32px;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:%s;">
				            Grace Arena Resorts &middot; Onimangoro, Igbo-Ora, Ibarapa Central, Oyo State, Nigeria<br>
				            This message was sent automatically. Replies reach our reservations desk.
				          </td>
				        </tr>
				      </table>
				    </td></tr>
				  </table>
				</body>
				</html>
				""".formatted(IVORY, IVORY, INK, GOLD, GOLD, INK, heading, BODY_TEXT, bodyHtml, IVORY, MUTED);
	}

	/** Gold call-to-action button. */
	static String button(String href, String label) {
		return """
				<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0;">
				  <tr><td style="background:%s;">
				    <a href="%s" style="display:inline-block;padding:14px 30px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:%s;text-decoration:none;">%s</a>
				  </td></tr>
				</table>
				""".formatted(GOLD, href, INK, label);
	}

	/** Two-column key/value block used for booking and enquiry summaries. */
	static String detailRows(String... labelThenValue) {
		StringBuilder rows = new StringBuilder(
				"<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" "
						+ "style=\"margin:8px 0 24px;border-top:1px solid #e7dfd0;\">");
		for (int i = 0; i + 1 < labelThenValue.length; i += 2) {
			rows.append("""
					<tr>
					  <td style="padding:11px 0;border-bottom:1px solid #e7dfd0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:%s;">%s</td>
					  <td align="right" style="padding:11px 0;border-bottom:1px solid #e7dfd0;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:%s;">%s</td>
					</tr>
					""".formatted(MUTED, escape(labelThenValue[i]), INK, escape(labelThenValue[i + 1])));
		}
		return rows.append("</table>").toString();
	}
}

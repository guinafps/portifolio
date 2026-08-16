"use client";

import { useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { usePreferences } from "./preferences";

export function ContactForm() {
  const { t } = usePreferences();
  const fields = [
    { name: "name", label: t("form.name"), placeholder: t("form.namePlaceholder"), type: "text", autoComplete: "name", minLength: 2, maxLength: 80 },
    { name: "email", label: t("form.email"), placeholder: "voce@empresa.com", type: "email", autoComplete: "email", maxLength: 160 },
    { name: "subject", label: t("form.subject"), placeholder: t("form.subjectPlaceholder"), type: "text", minLength: 3, maxLength: 120 },
  ] as const;
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [activeField, setActiveField] = useState(0);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("sending");
    setMessage("");
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || t("form.error"));
      setState("sent");
      setMessage(data.message || t("form.success"));
      setActiveField(4);
      formElement.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : t("form.retry"));
    }
  }

  return (
    <motion.form
      className="contact-form"
      onSubmit={submit}
      noValidate
      initial={{ opacity: 0, y: 38 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="contact-form-head">
        <div><span>{t("form.head")}</span><b>{t("form.steps")}</b></div>
        <div className="form-track" aria-hidden="true">
          {[0, 1, 2, 3].map((step) => <i className={step <= activeField ? "active" : ""} key={step} />)}
        </div>
      </div>

      {fields.map((field, index) => (
        <motion.label
          key={field.name}
          className={activeField === index ? "is-active" : ""}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: index * 0.06 }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <b>{field.label}</b>
            <input
              name={field.name}
              type={field.type}
              required
              minLength={"minLength" in field ? field.minLength : undefined}
              maxLength={field.maxLength}
              placeholder={field.placeholder}
              autoComplete={"autoComplete" in field ? field.autoComplete : undefined}
              onFocus={() => setActiveField(index)}
            />
          </div>
        </motion.label>
      ))}

      <motion.label
        className={activeField === 3 ? "is-active" : ""}
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.18 }}
      >
        <span>04</span>
        <div>
          <b>{t("form.idea")}</b>
          <textarea
            name="message"
            required
            minLength={20}
            maxLength={4000}
            placeholder={t("form.ideaPlaceholder")}
            rows={5}
            onFocus={() => setActiveField(3)}
          />
        </div>
      </motion.label>

      <div className="form-submit">
        <motion.button
          type="submit"
          disabled={state === "sending" || state === "sent"}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          {state === "sending" ? <LoaderCircle className="spin" /> : state === "sent" ? <Check /> : <ArrowRight />}
          {state === "sending" ? t("form.sending") : state === "sent" ? t("form.sent") : t("form.send")}
        </motion.button>
        <p className={`form-status ${state}`} role="status">{message}</p>
      </div>
    </motion.form>
  );
}


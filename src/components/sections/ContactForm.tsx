"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/lib/validation/contactSchema";

const fieldClass =
  "mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const serviceTypes = [
  "Dépannage",
  "Chauffage",
  "Sanitaires",
  "Recherche de fuite",
  "Canalisations",
  "Rénovation",
  "Autre",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { serviceType: serviceTypes[0] },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("send-failed");

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot anti-spam, invisible pour un utilisateur humain */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text">
            Nom
          </label>
          <input
            id="name"
            type="text"
            className={fieldClass}
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text">
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            className={fieldClass}
            {...register("phone")}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={fieldClass}
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-text">
          Type de besoin
        </label>
        <select
          id="serviceType"
          className={fieldClass}
          {...register("serviceType")}
        >
          {serviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className={fieldClass}
          {...register("message")}
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-3 text-sm tracking-wide text-on-accent uppercase transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        Envoyer ma demande
      </button>

      {status === "success" && (
        <p className="flex items-center gap-2 text-sm font-medium text-green-700">
          <CheckCircle2 size={16} />
          Votre message a bien été envoyé, nous revenons vers vous rapidement.
        </p>
      )}
      {status === "error" && (
        <p className="flex items-center gap-2 text-sm font-medium text-red-600">
          <AlertCircle size={16} />
          Une erreur est survenue, merci de réessayer ou de nous appeler directement.
        </p>
      )}
    </form>
  );
}

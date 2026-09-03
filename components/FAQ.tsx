"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";

type FaqItemProps = {
  question: string;
  answer: string;
};

function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (open && answerRef.current) {
      answerRef.current.style.maxHeight = "";
    } else if (answerRef.current) {
      answerRef.current.style.maxHeight =
        answerRef.current.scrollHeight + "px";
    }
    setOpen((o) => !o);
  };

  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <div className="faq-question" onClick={toggle}>
        <h4>{question}</h4>
        <span className="faq-icon">
          <i className="fas fa-chevron-down"></i>
        </span>
      </div>
      <div className="faq-answer" ref={answerRef}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

const FAQ_DATA = [
  {
    question: "Berapa lama proses instalasi?",
    answer:
      "Proses instalasi biasanya memakan waktu 1-2 hari kerja sejak data Anda terverifikasi. Tim teknisi profesional kami akan mengurus semuanya dengan cepat dan efisien.",
  },
  {
    question: "Apakah ada biaya tersembunyi?",
    answer:
      "Tidak ada biaya tersembunyi sama sekali. Semua biaya sudah tercantum jelas, dan instalasi serta router sudah termasuk gratis di setiap paket.",
  },
  {
    question: "Bagaimana jika internet mati tiba-tiba?",
    answer:
      "Hubungi support 24/7 kami melalui chat, WhatsApp, atau telepon. Tim kami akan segera membantu diagnosa dan perbaikan dalam waktu singkat.",
  },
  {
    question: "Bisa ganti paket kapan saja?",
    answer:
      "Ya, Anda bisa upgrade atau downgrade paket kapan saja tanpa penalti. Perubahan akan berlaku bulan berikutnya dengan proses yang sangat mudah.",
  },
  {
    question: "Apa itu SLA (Service Level Agreement)?",
    answer:
      "SLA adalah jaminan layanan kami dengan uptime 99.9%. Jika terjadi downtime di luar maintenance, Anda akan mendapat kompensasi kredit otomatis.",
  },
  {
    question: "Bagaimana kontrak dan komitmen waktu?",
    answer:
      "Kami menawarkan kontrak fleksibel mulai dari 1 bulan hingga 12 bulan. Semakin lama komitmen, semakin besar diskon yang Anda dapatkan.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Pertanyaan Umum</span>
            <h2>FAQ</h2>
            <p>
              Hal-hal yang paling sering ditanyakan oleh calon pelanggan.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="faq-wrap">
            {FAQ_DATA.map((item) => (
              <FaqItem key={item.question} {...item} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
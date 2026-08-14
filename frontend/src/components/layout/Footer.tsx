import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-primary-dark text-white">
      {/* Wave separator at top */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 80"
          className="w-full block"
          style={{ fill: "#f9fafb" }}
          preserveAspectRatio="none"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pt-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
                <img src="/logo-cirebon.png" alt="Logo Desa Budur" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl leading-tight text-white">Desa Budur</h3>
                <p className="text-sm text-gold-light">Kec. Ciwaringin, Kab. Cirebon</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Platform Smart Village Desa Budur mewujudkan tata kelola pemerintahan desa yang transparan, inovatif, dan responsif melalui digitalisasi pelayanan publik.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <SocialLink
                href="https://facebook.com/desabudur"
                label="Facebook"
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://www.instagram.com/desa.budur?igsh=MXB5dWowaXV1anRjMQ=="
                label="Instagram"
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                }
              />
              <SocialLink
                href="https://youtube.com/@desabudur?si=NijIagE1WzEv6LIT"
                label="YouTube"
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Col 2 — Layanan */}
          <div>
            <h4 className="font-heading font-bold text-base mb-6 text-white after:block after:w-8 after:h-0.5 after:bg-gold after:mt-2">
              Layanan Warga
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/layanan/surat" text="Pengajuan e-Surat" />
              <FooterLink href="/pengaduan" text="Lapor & Pengaduan" />
              <FooterLink href="/gis" text="Peta Batas Desa" />
              <FooterLink href="/sdgs" text="Capaian SDGs Desa" />
              <FooterLink href="/bansos" text="Cek Bantuan Sosial" />
            </ul>
          </div>

          {/* Col 3 — Transparansi */}
          <div>
            <h4 className="font-heading font-bold text-base mb-6 text-white after:block after:w-8 after:h-0.5 after:bg-gold after:mt-2">
              Transparansi
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/transparansi" text="Infografis APBDes" />
              <FooterLink href="/transparansi/pembangunan" text="Proyek Pembangunan" />
              <FooterLink href="/dokumen/perdes" text="Peraturan Desa" />
              <FooterLink href="/dokumen/rpjmdes" text="RPJMDes & RKPDes" />
              <FooterLink href="/statistik" text="Data Kependudukan" />
            </ul>
          </div>

          {/* Col 4 — Kontak */}
          <div>
            <h4 className="font-heading font-bold text-base mb-6 text-white after:block after:w-8 after:h-0.5 after:bg-gold after:mt-2">
              Hubungi Kami
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">
                  Jl. Raya Desa Budur No. 1, Kec. Ciwaringin, Kab. Cirebon, Jawa Barat 45167
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-gold shrink-0" />
                <span className="text-sm">(0231) XXXXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-gold shrink-0" />
                <span className="text-sm">pemdes@budur.desa.id</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Clock size={18} className="text-gold shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>Senin – Jumat</p>
                  <p className="text-gold-light font-medium">08.00 – 15.00 WIB</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Pemerintah Desa Budur. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gold-light transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 hover:text-gold-light hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5 text-sm group"
      >
        <span className="w-1 h-1 bg-gray-600 group-hover:bg-gold-light rounded-full transition-colors shrink-0" />
        {text}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold hover:text-primary-dark flex items-center justify-center text-gray-400 transition-all hover:scale-110 hover:shadow-lg hover:shadow-gold/30"
    >
      {icon}
    </a>
  );
}

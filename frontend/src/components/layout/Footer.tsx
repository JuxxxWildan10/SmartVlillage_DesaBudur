import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 border-t-[6px] border-primary">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex-center p-1">
                <svg viewBox="0 0 100 100" className="w-full h-full text-primary" fill="currentColor">
                  <path d="M50 10 L90 40 L90 90 L10 90 L10 40 Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl leading-tight text-white">Desa Budur</h3>
                <p className="text-sm text-gold-light">Kec. Ciwaringin</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Platform Smart Village Desa Budur mewujudkan tata kelola pemerintahan desa yang transparan, inovatif, dan responsif melalui digitalisasi pelayanan publik.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" label="FB" />
              <SocialLink href="#" label="IG" />
              <SocialLink href="#" label="X" />
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Layanan Warga</h4>
            <ul className="space-y-3">
              <FooterLink href="/layanan/surat" text="Pengajuan e-Surat" />
              <FooterLink href="/pengaduan" text="Lapor & Pengaduan" />
              <FooterLink href="/gis" text="Peta Batas Desa" />
              <FooterLink href="/sdgs" text="Capaian SDGs Desa" />
              <FooterLink href="/bansos" text="Cek Bantuan Sosial" />
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Transparansi</h4>
            <ul className="space-y-3">
              <FooterLink href="/transparansi/apbdes" text="Infografis APBDes" />
              <FooterLink href="/transparansi/pembangunan" text="Proyek Pembangunan" />
              <FooterLink href="/dokumen/perdes" text="Peraturan Desa" />
              <FooterLink href="/dokumen/rpjmdes" text="RPJMDes & RKPDes" />
              <FooterLink href="/statistik" text="Data Kependudukan" />
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={20} className="text-primary mt-1 shrink-0" />
                <span className="text-sm">Jl. Raya Desa Budur No. 1, Kec. Ciwaringin, Kab. Cirebon, Jawa Barat 45167</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={20} className="text-primary shrink-0" />
                <span className="text-sm">(0231) XXXXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={20} className="text-primary shrink-0" />
                <span className="text-sm">pemdes@budur.desa.id</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Pemerintah Desa Budur. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string, text: string }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-gold-light hover:translate-x-1 transition-all inline-block text-sm">
        {text}
      </Link>
    </li>
  );
}

function SocialLink({ href, label }: { href: string, label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex-center text-gray-400 hover:bg-primary hover:text-white transition-all font-bold text-xs">
      {label}
    </a>
  );
}

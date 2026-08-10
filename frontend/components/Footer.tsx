import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-yugen-background pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-24">
          
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif tracking-widest mb-6">YUGEN</h3>
            <p className="text-[12px] md:text-[14px] leading-[1.6] opacity-80 max-w-xs mb-8 text-[#6b6762]">
              Essence of simplicity. <br/>Made to be lived in.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:opacity-60 transition-opacity">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </Link>
              <Link href="#" className="hover:opacity-60 transition-opacity">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </Link>
              <Link href="#" className="hover:opacity-60 transition-opacity">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] md:text-[12px] uppercase tracking-[0.14em] font-medium mb-6 text-[#2d2a26]">Shop</h4>
            <ul className="space-y-4 text-[12px] md:text-[14px] opacity-80 text-[#6b6762]">
              <li><Link href="#" className="hover:opacity-100 transition-opacity">New In</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Women</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Men</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Collections</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] md:text-[12px] uppercase tracking-[0.14em] font-medium mb-6 text-[#2d2a26]">About</h4>
            <ul className="space-y-4 text-[12px] md:text-[14px] opacity-80 text-[#6b6762]">
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Our Story</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Sustainability</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Lookbook</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Journal</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] md:text-[12px] uppercase tracking-[0.14em] font-medium mb-6 text-[#2d2a26]">Customer Care</h4>
            <ul className="space-y-4 text-[12px] md:text-[14px] opacity-80 text-[#6b6762]">
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Contact Us</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Shipping</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Returns</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] md:text-[12px] uppercase tracking-[0.14em] font-medium mb-6 text-[#2d2a26]">Legal</h4>
            <ul className="space-y-4 text-[12px] md:text-[14px] opacity-80 text-[#6b6762]">
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition-opacity">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/10 text-[10px] md:text-[11px] uppercase tracking-[0.1em] opacity-60 text-[#6b6762]">
          <p>&copy; 2026 YUGEN. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Discover Simple</span>
            <span>Essence Of Matter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

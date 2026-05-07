import { Link } from "react-router-dom";
import { Home, Swords } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="text-8xl animate-bounce">🏏</div>
      <div>
        <h1 className="font-display text-5xl font-black text-gradient-cyan">404</h1>
        <p className="text-xl font-bold text-white mt-2">Out! Page Not Found</p>
        <p className="text-white/40 text-sm mt-2 max-w-sm">
          Looks like that delivery pitched outside the stumps. Let's head back to the pavilion.
        </p>
      </div>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary"><Home size={16} /> Back to Dashboard</Link>
        <Link to="/coaching-room" className="btn-secondary"><Swords size={16} /> Coaching Room</Link>
      </div>
    </div>
  );
}

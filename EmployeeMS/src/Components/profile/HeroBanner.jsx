import { Award, Briefcase, MapPin, Pencil, MessageCircle } from "lucide-react";

export default function HeroBanner({
  employee,
  user,
  navigate,
  onToggleMessage,
}) {
  return (
    <div className="relative mb-4 flex w-full items-center gap-6 overflow-hidden rounded-[20px] bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 px-7 py-5 shadow-lg">

      {/* Background Circles */}

      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />

      <div className="absolute bottom-[-60px] right-32 h-44 w-44 rounded-full bg-white/5" />

      {/* Avatar */}

      <div className="relative shrink-0">

        <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/30 bg-blue-100 shadow-lg">

          <img
            src={employee.avatar}
            alt={employee.name}
            className="h-full w-full object-cover"
          />

        </div>

        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-blue-800 bg-green-500"></span>

      </div>

      {/* Profile */}

      <div className="flex-1">

        <div className="mb-2 flex items-center gap-4">

          <h1 className="text-2xl font-extrabold text-white">

            {employee.name}

          </h1>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-blue-100">

            <Award size={14} />

            Top Performer

          </span>

        </div>

        <p className="mb-4 text-blue-100">

          {employee.title}

        </p>

        <div className="flex flex-wrap gap-3">

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">

            <Briefcase size={15} />

            {employee.department}

          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">

            <MapPin size={15} />

            {employee.location}

          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-200">

            <span className="h-2 w-2 rounded-full bg-green-400"></span>

            {employee.status}

          </span>

        </div>

      </div>

      {/* Right */}

      <div className="text-right">

        <p className="text-xs uppercase tracking-widest text-blue-200">

          Employee ID

        </p>

        <h2 className="text-3xl font-extrabold text-white">

          {employee.id}

        </h2>

        <div className="mt-5 flex justify-end gap-5">

          <button
            onClick={() =>
              navigate(`/employee/edit-employee/${user.id}`)
            }
            className="text-white transition hover:scale-110"
          >
            <Pencil size={20} />
          </button>

          <div className="h-6 w-px bg-white/20"></div>

          <button
            onClick={onToggleMessage}
            className="text-white transition hover:scale-110"
          >
            <MessageCircle size={20} />
          </button>

        </div>

      </div>

    </div>
  );
}
// Separate OurTeam component
export function OurTeam() {
  const team = [
    {
      name: "Aisha Khan",
      role: "Founder & CEO",
      bio: "Passionate about making housing accessible. Loves kayaking and sustainable design.",
      img: "https://i.pravatar.cc/300?img=47",
    },
    {
      name: "Rahul Verma",
      role: "Head of Product",
      bio: "Builds delightful product experiences and maps user journeys.",
      img: "https://i.pravatar.cc/300?img=12",
    },
    {
      name: "Sneha Roy",
      role: "Lead Engineer",
      bio: "Backend systems, scalability and developer experience are her forte.",
      img: "https://i.pravatar.cc/300?img=5",
    },
    {
      name: "Vikram Patel",
      role: "Community Manager",
      bio: "Helps renters and landlords get the most out of the platform.",
      img: "https://i.pravatar.cc/300?img=15",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((m) => (
          <div
            key={m.name}
            className="flex flex-col items-center text-center rounded-2xl p-6  bg-white shadow-sm"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 ring-4 ring-offset-2 ring-[var(--color-bg)]">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
            </div>

            <div className="text-[var(--color-darkest)] font-semibold">{m.name}</div>
            <div className="text-sm text-[var(--color-darker)] mb-2">{m.role}</div>
            <p className="text-sm text-[var(--color-darker)]">{m.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
import HeroBanner from "../components/profile/HeroBanner";
import StatCard from "../components/profile/StatCard";
import { employee, stats } from "../data/profileData";


<div className="mb-4 grid grid-cols-4 gap-4">
  {stats.map((item) => (
    <StatCard
      key={item.id}
      value={item.value}
      label={item.label}
      subtitle={item.subtitle}
      color={item.color}
      icon={item.icon}
    />
  ))}
</div>
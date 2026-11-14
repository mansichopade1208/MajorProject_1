
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowRight, Search } from "lucide-react";

export default function RecentPatients({
  patients,
  selectedPatientId,
  onSelectPatient,
}) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.complaint}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="bg-white border border-[#E8E5DE]
    rounded-2xl p-4 sm:p-5 shadow-sm">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <Users size={25} />
          Recent Patient Encounters
        </h2>

        <button
          onClick={() => navigate("/doctor/patients")}
          className="text-sm font-semibold flex items-center gap-2"
        >
          View All <ArrowRight size={18} />
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={17} className="absolute left-3 top-3
        text-[#789087]" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl
          bg-[#f3f4ed] outline-none text-sm
          focus:ring-2 focus:ring-[#8aada0]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left">

          <thead>
            <tr className="bg-[#E8F0EA] text-[#254a42] text-sm">
              <th className="p-3 rounded-l-xl">Patient Name</th>
              <th className="p-3">Complaint</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 rounded-r-xl">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className={`border-b border-[#e9e6df]
                hover:bg-[#f5f7f1]
                ${selectedPatientId === patient.id
                  ? "bg-[#f1f6f2]"
                  : ""}`}
              >
                <td className="p-3 font-medium whitespace-nowrap">
                  {patient.name}
                </td>

                <td className="p-3 text-sm whitespace-nowrap">
                  {patient.complaint}
                </td>

                <td className="p-3 text-sm whitespace-nowrap">
                  {patient.date}
                </td>

                <td className="p-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs
                  font-semibold whitespace-nowrap
                  ${patient.status === "Pending"
                    ? "bg-[#fae2d5] text-[#a74729]"
                    : "bg-[#e0eee8] text-[#286454]"}`}>
                    {patient.status}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => {
                      onSelectPatient(patient.id);
                      navigate(`/doctor/patients/${patient.id}`);
                    }}
                    className="bg-[#527c70] text-white px-5 py-2
                    rounded-full text-sm hover:bg-[#345e54]"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {filteredPatients.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-8">
            No patients found.
          </p>
        )}
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import {
  listEmployee,
  listEmployeeById,
  updateSkills,
} from "@/src/features/employee/employeeApi";
import { toast } from "sonner";

interface Skill {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

interface SkillGroup {
  id: number;
  name: string;
  description: string;
  skills: Skill[];
}

interface EmployeeSkillsProps {
  employee: any;
  skillsData: { skill: string; value: number }[];
  listSkills: SkillGroup[];
}

const EmployeeSkills: React.FC<EmployeeSkillsProps> = ({
  employee,
  skillsData,
  listSkills,
}) => {
  const dispatch = useDispatch();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    employee.skill_groups.length > 0 ? employee.skill_groups[0].id : null
  );
  const [groupsSkillsValues, setGroupsSkillsValues] = useState<{
    [groupId: number]: { skill: string; value: number }[];
  }>({});
  const [currentSkillsData, setCurrentSkillsData] = useState(skillsData);
  const [backupGroupsSkillsValues, setBackupGroupsSkillsValues] = useState<{
    [key: number]: { skill: string; value: number }[];
  }>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedGroupId === null) return;

    const selectedGroup = listSkills.find((g) => g.id === selectedGroupId);
    if (!selectedGroup) return;

    const isExistingGroup = employee.skill_groups.some(
      (g: any) => g.id === selectedGroupId
    );

    const prevValues = groupsSkillsValues[selectedGroupId] || [];

    const newSkillsData = selectedGroup.skills.map((skill) => {
      const prevSkill = prevValues.find((s) => s.skill === skill.name);
      if (prevSkill) return prevSkill;

      if (isExistingGroup) {
        const existingSkill = skillsData.find((s) => s.skill === skill.name);
        return {
          skill: skill.name,
          value: existingSkill ? existingSkill.value : 0,
        };
      }

      return {
        skill: skill.name,
        value: 0,
      };
    });

    setCurrentSkillsData(newSkillsData);
    setGroupsSkillsValues((prev) => ({
      ...prev,
      [selectedGroupId]: newSkillsData,
    }));

    setBackupGroupsSkillsValues((prev) => ({
      ...prev,
      [selectedGroupId]: newSkillsData.map((s) => ({ ...s })),
    }));
  }, [selectedGroupId]);

  const handleSkillValueChange = (skillName: string, newValue: number) => {
    setCurrentSkillsData((prev) =>
      prev.map((s) => (s.skill === skillName ? { ...s, value: newValue } : s))
    );

    if (selectedGroupId !== null) {
      setGroupsSkillsValues((prev) => ({
        ...prev,
        [selectedGroupId]: prev[selectedGroupId]
          ? prev[selectedGroupId].map((s) =>
              s.skill === skillName ? { ...s, value: newValue } : s
            )
          : [{ skill: skillName, value: newValue }],
      }));
    }
  };

  const handleSave = async (employee: any) => {
    if (selectedGroupId === null) return;

    const selectedGroup = listSkills.find((g) => g.id === selectedGroupId);
    if (!selectedGroup) return;

    const skillsWithId = currentSkillsData.map((s) => {
      const skillObj = selectedGroup.skills.find(
        (skill) => skill.name === s.skill
      );
      return {
        id: skillObj?.id,
        value: s.value,
      };
    });

    const res = await dispatch(
      updateSkills({
        id: employee.id,
        mainGroupId: selectedGroupId,
        skills: skillsWithId,
      }) as any
    );
    if (res.payload.status == 200 || res.payload.status == 201) {
      await dispatch(listEmployeeById(employee.id as any) as any);
      toast.success(res.payload.data.message)
    }
    // console.log({
    //   mainGroupId: selectedGroupId,
    //   skills: skillsWithId,
    // });
  };

  const handleCancel = () => {
    if (selectedGroupId !== null) {
      setCurrentSkillsData(
        backupGroupsSkillsValues[selectedGroupId].map((s) => ({ ...s }))
      );
      setGroupsSkillsValues((prev) => ({
        ...prev,
        [selectedGroupId]: backupGroupsSkillsValues[selectedGroupId].map(
          (s) => ({
            ...s,
          })
        ),
      }));
    }
  };

  console.log("ở modal",employee)

  return (
    <div className="space-y-3 sm:space-y-4 mt-0 overflow-x-hidden">
      {/* --- Nút chỉnh sửa nhóm kỹ năng --- */}
      <div className="flex items-center gap-2">
        <label className="text-white/80 text-sm hidden sm:block">
          Chọn nhóm kỹ năng:
        </label>
        <select
          className="bg-black/50 text-white border border-purple-500/30 p-1 rounded"
          value={selectedGroupId ?? ""}
          onChange={(e) => setSelectedGroupId(Number(e.target.value))}
        >
          <option value="" disabled>
            -- Chọn nhóm --
          </option>
          {listSkills.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* --- Biểu đồ kỹ năng --- */}
      <Card className="bg-black/50 border-purple-500/30 overflow-x-hidden">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-lg">
            Biểu đồ kỹ năng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-hidden">
          {currentSkillsData.length > 0 ? (
            <div className="w-full overflow-x-hidden">
              <ResponsiveContainer
                width="100%"
                height={300}
                className="sm:h-[400px]"
              >
                <RadarChart data={currentSkillsData}>
                  <PolarGrid stroke="#a855f7" strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "#fff", fontSize: 10 }}
                    className="sm:text-xs"
                    tickLine={{ stroke: "#a855f7" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#fff", fontSize: 10 }}
                    className="sm:text-xs"
                    tickLine={{ stroke: "#a855f7" }}
                  />
                  <Radar
                    name="Kỹ năng"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #a855f7",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ color: "#fff", fontSize: "12px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/60 text-center py-8 text-xs sm:text-base">
              Chưa có dữ liệu kỹ năng
            </p>
          )}
        </CardContent>
      </Card>

      {/* --- Chi tiết kỹ năng với slider chỉnh value --- */}
      <Card className="bg-black/50 border-purple-500/30 overflow-x-hidden">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-lg">
            Chi tiết kỹ năng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-x-hidden">
            {currentSkillsData.length > 0 ? (
              currentSkillsData.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-white/80 text-xs sm:text-base">
                    <span>{skill.skill}</span>
                    <span>{skill.value}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.value}
                    onChange={(e) =>
                      handleSkillValueChange(
                        skill.skill,
                        Number(e.target.value)
                      )
                    }
                    className="w-full accent-purple-600"
                  />
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4 col-span-2 text-xs sm:text-base">
                Chưa có dữ liệu kỹ năng
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {isEditing ? (
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => {
              handleSave(employee);
              setIsEditing(false); // tắt chế độ chỉnh sửa sau khi lưu
            }}
          >
            Lưu
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => {
              handleCancel();
              setIsEditing(false); // tắt chế độ chỉnh sửa khi hủy
            }}
          >
            Hủy
          </button>
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setIsEditing(true)}
        >
          Chỉnh sửa
        </button>
      )}
    </div>
  );
};

export default EmployeeSkills;

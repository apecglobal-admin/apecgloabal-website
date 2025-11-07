import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface EmployeeModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (open: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  editingEmployee: any;
  departments: any[];
  positions: any[];
  contacts: any[];
  managers: any[];
  skills: any[];
  handleSave: () => void;
}

const CreateAndEditModalEmployee: React.FC<EmployeeModalProps> = ({
  showCreateModal,
  setShowCreateModal,
  formData,
  setFormData,
  editingEmployee,
  departments,
  positions,
  contacts,
  managers,
  skills,
  handleSave,
}) => {
  return (
    <>
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-7xl h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingEmployee ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Row 1: Thông tin cơ bản + CCCD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thông tin cơ bản */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin Cơ Bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editingEmployee && (
                    <div>
                      <Label htmlFor="id" className="text-white">
                        Mã Nhân Viên
                      </Label>
                      <Input
                        id="id"
                        placeholder="NV001"
                        value={formData.id}
                        onChange={(e) =>
                          setFormData({ ...formData, id: e.target.value })
                        }
                        className="bg-black/30 border-purple-500/30 text-white"
                        disabled={true}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="name" className="text-white">
                      Họ Tên *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nhập họ tên"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthday" className="text-white">
                      Ngày Sinh
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) =>
                        setFormData({ ...formData, birthday: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gen" className="text-white">
                      Giới Tính
                    </Label>
                    <Select
                      value={formData.gen?.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gen: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Nam</SelectItem>
                        <SelectItem value="2">Nữ</SelectItem>
                        <SelectItem value="3">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="birth_place" className="text-white">
                      Nơi Sinh
                    </Label>
                    <Input
                      id="birth_place"
                      placeholder="Tỉnh/Thành phố"
                      value={formData.birth_place}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          birth_place: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-white">
                      Địa Chỉ
                    </Label>
                    <Input
                      id="address"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-white">
                      Ngày gia nhập
                    </Label>
                    <Input
                      id="join_date"
                      type="date"
                      placeholder="2023-01-01"
                      value={formData.join_date}
                      onChange={(e) =>
                        setFormData({ ...formData, join_date: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* CCCD */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin CCCD
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="citizen_card" className="text-white">
                      Số CCCD
                    </Label>
                    <Input
                      id="citizen_card"
                      placeholder="001234567890"
                      value={formData.citizen_card}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          citizen_card: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="issue_date" className="text-white">
                      Ngày Cấp
                    </Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) =>
                        setFormData({ ...formData, issue_date: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="issue_place" className="text-white">
                      Nơi Cấp
                    </Label>
                    <Input
                      id="issue_place"
                      placeholder="Cục Cảnh sát..."
                      value={formData.issue_place}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          issue_place: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Học vấn + Hợp đồng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Học vấn */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin Học Vấn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="degree_level" className="text-white">
                      Trình Độ
                    </Label>
                    <Select
                      value={formData.degree_level}
                      onValueChange={(value) =>
                        setFormData({ ...formData, degree_level: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn trình độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                        <SelectItem value="Cao đẳng">Cao đẳng</SelectItem>
                        <SelectItem value="Đại học">Đại học</SelectItem>
                        <SelectItem value="Thạc sĩ">Thạc sĩ</SelectItem>
                        <SelectItem value="Tiến sĩ">Tiến sĩ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="major" className="text-white">
                      Chuyên Ngành
                    </Label>
                    <Input
                      id="major"
                      placeholder="Công nghệ thông tin"
                      value={formData.major}
                      onChange={(e) =>
                        setFormData({ ...formData, major: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="school_name" className="text-white">
                      Trường
                    </Label>
                    <Input
                      id="school_name"
                      placeholder="Tên trường"
                      value={formData.school_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school_name: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="graduation_year" className="text-white">
                      Năm Tốt Nghiệp
                    </Label>
                    <Input
                      id="graduation_year"
                      type="number"
                      placeholder="2023"
                      value={formData.graduation_year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          graduation_year: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="certificate_name" className="text-white">
                      Chứng Chỉ
                    </Label>
                    <Input
                      id="certificate_name"
                      placeholder="AWS, PMP, TOEIC..."
                      value={formData.certificate_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certificate_name: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Hợp đồng & Lương */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin Hợp Đồng & Lương
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contract_type" className="text-white">
                      Phòng ban
                    </Label>
                    <Select
                      value={formData.department_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, department_id: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn phòng ban" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((item: any) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contract_type" className="text-white">
                      Chức vụ
                    </Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) =>
                        setFormData({ ...formData, position: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn chức vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((item: any) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contract_type" className="text-white">
                      Loại Hợp Đồng
                    </Label>
                    <Select
                      value={formData.contract_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, contract_type: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn loại hợp đồng" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="base_salary" className="text-white">
                      Lương Cơ Bản (VNĐ)
                    </Label>
                    <Input
                      id="base_salary"
                      type="number"
                      placeholder="10000000"
                      value={formData.base_salary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          base_salary: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="allowance" className="text-white">
                      Phụ Cấp (VNĐ)
                    </Label>
                    <Input
                      id="allowance"
                      type="number"
                      placeholder="2000000"
                      value={formData.allowance}
                      onChange={(e) =>
                        setFormData({ ...formData, allowance: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="manager_id" className="text-white">
                      Người duyệt
                    </Label>
                    <Select
                      value={formData.manager_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, manager_id: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn người duyệt" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((item: any) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Liên hệ + Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liên hệ */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin Liên Hệ
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Số Điện Thoại
                    </Label>
                    <Input
                      id="phone"
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergency_contract" className="text-white">
                      Liên Lạc Khẩn Cấp
                    </Label>
                    <Input
                      id="emergency_contract"
                      placeholder="Tên người liên hệ - SĐT"
                      value={formData.emergency_contract}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contract: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Kỹ Năng
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skill_group_id" className="text-white">
                      Nhóm Kỹ Năng
                    </Label>
                    <Select
                      value={formData.skill_group_id}
                      onValueChange={(value) => {
                        const selectedGroup = skills.find(
                          (group: any) => group.id === Number(value)
                        );

                        setFormData({
                          ...formData,
                          skill_group_id: value,
                          skills: selectedGroup
                            ? selectedGroup.skills.map((s: any) => ({
                                skill_id: s.id,
                                value: "",
                              }))
                            : [],
                        });
                      }}
                      disabled={
                        editingEmployee !== null && formData.skills.length > 0
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn nhóm kỹ năng" />
                      </SelectTrigger>
                      <SelectContent>
                        {skills.map((group: any) => (
                          <SelectItem
                            key={group.id}
                            value={group.id.toString()}
                          >
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Danh Sách Kỹ Năng
                    </Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {formData.skills?.map((skill: any, index: any) => {
                        let skillName = skill.name || "";

                        if (!skillName) {
                          const group = skills.find(
                            (g: any) => g.id === Number(formData.skill_group_id)
                          );
                          skillName =
                            group?.skills.find(
                              (s: any) => s.id === skill.skill_id
                            )?.name || "";
                        }

                        if (!skillName) {
                          for (const group of skills) {
                            const foundSkill = group.skills?.find(
                              (s: any) => s.id === skill.skill_id
                            );
                            if (foundSkill) {
                              skillName = foundSkill.name;
                              break;
                            }
                          }
                        }

                        return (
                          <div key={index} className="flex gap-2 items-center">
                            <Input
                              disabled
                              value={skillName || `Skill ID: ${skill.skill_id}`}
                              className="bg-black/30 border-purple-500/30 text-white flex-1"
                            />
                            <Input
                              placeholder="Giá trị"
                              value={skill.value}
                              onChange={(e) => {
                                const newSkills = [...formData.skills];
                                newSkills[index].value = e.target.value;
                                setFormData({ ...formData, skills: newSkills });
                              }}
                              className="bg-black/30 border-purple-500/30 text-white flex-1"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-purple-500/30">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="border-purple-500/30 text-white hover:bg-purple-500/10"
              >
                Hủy
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSave}
              >
                {editingEmployee ? "Cập Nhật" : "Thêm Mới"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAndEditModalEmployee;

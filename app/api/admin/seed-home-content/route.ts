import { NextRequest, NextResponse } from 'next/server';
import { updateHomeContent } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Seed initial home content data
    const initialData = {
      infoHighlights: [
        {
          icon: "building2",
          title: "Quy mô & Vốn hóa",
          description: "Vốn hoạt động 2.868 tỷ đồng, thuộc hệ sinh thái IMP Holding Hoa Kỳ.",
          accent: "red"
        },
        {
          icon: "building2",
          title: "Lĩnh vực trọng điểm",
          description: "Tài chính, công nghệ, thương mại, kinh tế cộng đồng và kinh tế tuần hoàn.",
          accent: "blue"
        },
        {
          icon: "mappin",
          title: "Trụ sở & Liên hệ",
          description: "04 Lê Tuấn Mậu, Q6, TP. HCM · Hotline: 1900 3165 · info@apecglobal.vn",
          accent: "green"
        },
        {
          icon: "globe",
          title: "Hệ sinh thái thương hiệu",
          description: "Apec BCI, Life Care, Ecoop, Queency, Nam Thiên Long Security, Kangaroo I-On…",
          accent: "purple"
        }
      ],
      quickFacts: [
        {
          icon: "history",
          label: "2004 - 2024",
          description: "Hành trình mở rộng từ bảo vệ tới công nghệ",
          accent: "red"
        },
        {
          icon: "building2",
          label: "Đa ngành",
          description: "Tài chính, công nghệ, thương mại, cộng đồng",
          accent: "blue"
        },
        {
          icon: "users",
          label: "Cộng đồng mạnh",
          description: "Hỗ trợ doanh nghiệp, phát triển thẻ Apec",
          accent: "green"
        },
        {
          icon: "crown",
          label: "Đối tác chiến lược",
          description: "ASI, EDEN, ARIC, HappyLand, METTITECH, SST",
          accent: "purple"
        }
      ],
      valuePillars: [
        {
          icon: "target",
          title: "Tầm Nhìn",
          description: "10 năm trở thành tập đoàn đầu tư đa quốc gia với hệ sinh thái khỏe mạnh.",
          accent: "red"
        },
        {
          icon: "building2",
          title: "Sứ Mệnh",
          description: "Đầu tư, tái thiết doanh nghiệp, nâng tầm thương hiệu và tri thức hiện đại.",
          accent: "blue"
        },
        {
          icon: "history",
          title: "Giá Trị Cốt Lõi",
          description: "TÂM sáng, TÂM bảo, TÂM huyết, TÂM khởi, TÂM thục, TÂM đạo.",
          accent: "green"
        },
        {
          icon: "crown",
          title: "Định Hướng",
          description: "Chứng tỏ kiến tạo giá trị, tạo nền tảng bền vững cho cộng đồng.",
          accent: "purple"
        }
      ],
      careerBenefits: [
        {
          icon: "heart",
          title: "Môi trường tuyệt vời",
          description: "Văn hóa tích cực, đồng nghiệp thân thiện, hỗ trợ nhiệt tình.",
          accent: "red"
        },
        {
          icon: "trendingup",
          title: "Cơ hội phát triển",
          description: "Đào tạo liên tục, thăng tiến rõ ràng, dự án công nghệ tiên tiến.",
          accent: "blue"
        },
        {
          icon: "dollarsign",
          title: "Lương thưởng hấp dẫn",
          description: "Lương cạnh tranh, thưởng hiệu suất, phúc lợi đầy đủ.",
          accent: "green"
        },
        {
          icon: "coffee",
          title: "Work-life balance",
          description: "Linh hoạt, remote, nhiều hoạt động kết nối đội nhóm.",
          accent: "purple"
        }
      ],
      ctaMetrics: [
        { value: "5+", label: "Công ty thành viên" },
        { value: "100+", label: "Dự án thành công" },
        { value: "1000+", label: "Khách hàng tin tưởng" },
        { value: "24/7", label: "Hỗ trợ khách hàng" }
      ]
    };

    // Insert each section
    for (const [section, data] of Object.entries(initialData)) {
      await updateHomeContent(section, data);
    }

    return NextResponse.json({
      success: true,
      message: 'Home content seeded successfully'
    });

  } catch (error) {
    console.error('Error seeding home content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed home content'
    }, { status: 500 });
  }
}
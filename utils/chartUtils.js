export const chartUtils =  {
    // 차트에 표시할 카테고리 데이터를 가공하는 함수
    // 상위 5개만 표시, 나머지는 기타로 묶어서 처리
    // 최종적으로 카테고리명 배열과 금액 배열 반환
    processChartData(categories, maxLabels = 5){
        const sortedCategories = [...categories].sort((a, b) => b.total - a.total);
        const topCategories = sortedCategories.slice(0, maxLabels);
        const others = sortedCategories.slice(maxLabels);

        const topLabels = topCategories.map(item => item.category);
        const topData = topCategories.map(item => item.total);

        if (others.length > 0) {
            topLabels.push("기타");
            topData.push(others.reduce((sum, item) => sum + item.total, 0));
        }

        return { labels: topLabels, data: topData };
    },

    chartColors: [
        "#FF8C42", // 부드러운 오렌지
        "#FFA559", // 연한 살구색
        "#FFD57E", // 밝은 머스타드
        "#FFE8A3", // 은은한 크림 노랑
        "#FFF4D2", // 연한 레몬빛
        "#F6C89F", // 따뜻한 코랄 주황
    ],
    
    donutChartOptions:{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: { boxWidth: 12, boxHeight: 12 }
            }
        }
    },

    barChartOptions: {
        responsive: true,
        plugins: {
          legend: { labels: "", position: "bottom" }
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => value >= 1000000 ? `${value / 1000000}백만` : value
            }
          }
        }
    }

    
}
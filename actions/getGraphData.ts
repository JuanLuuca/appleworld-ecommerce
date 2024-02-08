import prisma from "@/libs/prismadb";
import moment from "moment";
import "moment/locale/pt-br"; 

export default async function getGraphData() {
    try {
        moment.locale('pt-br');

        const startDate = moment().subtract(6, "days").startOf("day");
        const endDate = moment().endOf("day");

        const result = await prisma.order.groupBy({
            by: ["createDate"],
            where: {
                createDate: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString()
                },
                paymentStatus: "completo"
            },
            _sum: {
                amount: true,
            },
        });

        const aggragateData: {
            [day: string]: { day: string, date: string, totalAmount: number };
        } = {};

        const currentDate = startDate.clone();

        while (currentDate <= endDate) {
            const day = currentDate.format("dddd");

            aggragateData[day] = {
                day,
                date: currentDate.format("YYYY-MM-DD"),
                totalAmount: 0, 
            };

            currentDate.add(1, "day");
        }

        result.forEach((entry) => {
            const day = moment(entry.createDate).format("dddd");
            const amount = entry._sum.amount || 0;
            aggragateData[day].totalAmount = amount;
        });

        const formattedData = Object.values(aggragateData).sort((a, b) => 
            moment(a.date).diff(moment(b.date))
        );

        return formattedData;
    } catch (error: any) {
        throw new Error(error);
    }
}

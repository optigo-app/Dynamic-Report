import { Chip, Paper, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";



const DelayByMonthArearChart = ({ delaybyday }) => {
    console.log("🚀 ~ DelayByMonthArearChart ~ delaybyday:", delaybyday)
    if (!delaybyday || delaybyday.length === 0) return null;
    const firstDate = parseISO(delaybyday[0].date);
    const chartTitle = `Delay by Days - ${format(firstDate, "MMMM yyyy")}`;
    const FormattedDate = delaybyday?.map((val, i) => ({
        day: i + 1,
        delayPercent: Number(val?.delayPercent?.toFixed(2)),
    }));
    return (
        <>
            <Typography variant="h6" mb={3}>
                {chartTitle}
            </Typography>
            <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={FormattedDate}>
                    <defs>
                        <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={({ x, y, payload }) => {
                            const day = payload.value;
                            return (
                                <foreignObject x={x - 10} y={y + 0} width={30} height={30}>
                                    <Chip
                                        label={`${day}`}
                                        size="small"
                                        color="primary"
                                        sx={{
                                            fontSize: 10,
                                            height: 24,
                                            borderRadius: "16px",
                                            px: 1,
                                            bgcolor: "#4f46e5",
                                            color: "#fff",
                                            ".MuiChip-label": {
                                                padding: 0,
                                            },
                                        }}
                                    />
                                </foreignObject>
                            );
                        }}
                    />
                    <YAxis hide />
                    <Tooltip
                        content={<CustomTooltip />}
                        formatter={(value) => [`${value}%`, "Delay %"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="delayPercent"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorDelay)"
                    >
                        <LabelList
                            dataKey="delayPercent"
                            position="top"
                            dy={-10}
                            style={{
                                fontSize: 12,
                                fill: "#111",
                                fontWeight: 500,
                            }}
                            formatter={(val) => `${val}%`}
                        />
                    </Area>

                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};

export default DelayByMonthArearChart;





const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const value = payload[0]?.value;

    return (
        <Paper
            elevation={3}
            sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255,255,255,0.9)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
            >
                Day {label}
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
                {value}%
            </Typography>
        </Paper>
    );
};
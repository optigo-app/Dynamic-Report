import React from 'react';
import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useState, useRef, useEffect } from 'react'
import autoAnimate from '@formkit/auto-animate'

const TestReport = () => {
    const theme = useTheme();
    const barChartOption = {
        title: { text: 'Revenue Analysis', left: 'center', textStyle: { color: theme.palette.text.primary } },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: ['Q1', 'Q2', 'Q3', 'Q4'],
            axisLabel: { color: theme.palette.text.secondary }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: theme.palette.text.secondary }
        },
        series: [{
            data: [120, 200, 150, 180],
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: theme.palette.primary.main },
                    { offset: 1, color: theme.palette.primary.light }
                ])
            },
            borderRadius: [8, 8, 0, 0]
        }]
    };

    // Chart 2: Doughnut Chart
    const doughnutChartOption = {
        title: { text: 'Market Share', left: 'center', textStyle: { color: theme.palette.text.primary } },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left', textStyle: { color: theme.palette.text.secondary } },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
            label: { show: false, position: 'center' },
            emphasis: {
                label: { show: true, fontSize: 20, fontWeight: 'bold' }
            },
            labelLine: { show: false },
            data: [
                { value: 1048, name: 'Product A', itemStyle: { color: '#FF6384' } },
                { value: 735, name: 'Product B', itemStyle: { color: '#36A2EB' } },
                { value: 580, name: 'Product C', itemStyle: { color: '#FFCE56' } },
                { value: 484, name: 'Product D', itemStyle: { color: '#4BC0C0' } }
            ]
        }]
    };

    // Chart 3: Line Chart with Area
    const lineChartOption = {
        title: { text: 'Growth Trends', left: 'center', textStyle: { color: theme.palette.text.primary } },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            axisLabel: { color: theme.palette.text.secondary }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: theme.palette.text.secondary }
        },
        series: [{
            type: 'line',
            smooth: true,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(128, 128, 255, 0.5)' },
                    { offset: 1, color: 'rgba(128, 128, 255, 0.1)' }
                ])
            },
            data: [820, 932, 901, 934, 1290, 1330],
            lineStyle: { width: 3, color: '#8080ff' },
            itemStyle: { color: '#8080ff' }
        }]
    };

    // Chart 4: Radar Chart
    const radarChartOption = {
        title: { text: 'Performance Metrics', left: 'center', textStyle: { color: theme.palette.text.primary } },
        radar: {
            indicator: [
                { name: 'Quality', max: 100 },
                { name: 'Speed', max: 100 },
                { name: 'Accuracy', max: 100 },
                { name: 'Efficiency', max: 100 },
                { name: 'Reliability', max: 100 }
            ]
        },
        series: [{
            type: 'radar',
            data: [{
                value: [80, 90, 75, 95, 85],
                name: 'Current Performance',
                areaStyle: { color: 'rgba(255, 99, 132, 0.2)' },
                lineStyle: { color: '#FF6384' },
                itemStyle: { color: '#FF6384' }
            }]
        }]
    };

    // Chart 5: Gauge Chart
    const gaugeChartOption = {
        title: { text: 'Completion Rate', left: 'center', textStyle: { color: theme.palette.text.primary } },
        series: [{
            type: 'gauge',
            progress: { show: true, width: 18 },
            axisLine: { lineStyle: { width: 18 } },
            axisTick: { show: false },
            splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
            axisLabel: { distance: 25, color: '#999', fontSize: 12 },
            anchor: { show: true, showAbove: true, size: 25, itemStyle: { color: '#FAC858' } },
            detail: { valueAnimation: true, fontSize: 30, offsetCenter: [0, '70%'] },
            data: [{
                value: 85,
                name: 'SCORE',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#1a90ff' },
                        { offset: 1, color: '#1a39ff' }
                    ])
                }
            }]
        }]
    };

    // Chart 6: Horizontal Bar Chart
    const horizontalBarOption = {
        title: { text: 'Department Performance', left: 'center', textStyle: { color: theme.palette.text.primary } },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'value',
            axisLabel: { color: theme.palette.text.secondary }
        },
        yAxis: {
            type: 'category',
            data: ['Sales', 'Marketing', 'Development', 'Support', 'HR'],
            axisLabel: { color: theme.palette.text.secondary }
        },
        series: [{
            type: 'bar',
            data: [320, 302, 301, 334, 390],
            itemStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                ])
            },
            borderRadius: [0, 8, 8, 0]
        }]
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={3}>
                {/* First Row */}
                <Grid item xs={12} sm={6} md={4}>
                    <Dropdown />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
                            Revenue Analysis
                        </Typography>
                        <Box sx={{ flex: 1, minHeight: 300 }}>
                            <ReactECharts option={barChartOption} style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
                            Market Share
                        </Typography>
                        <Box sx={{ flex: 1, minHeight: 300 }}>
                            <ReactECharts option={doughnutChartOption} style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
                            Growth Trends
                        </Typography>
                        <Box sx={{ flex: 1, minHeight: 300 }}>
                            <ReactECharts option={lineChartOption} style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Second Row */}
                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
                            Performance Metrics
                        </Typography>
                        <Box sx={{ flex: 1, minHeight: 300 }}>
                            <ReactECharts option={radarChartOption} style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
                            Completion Rate
                        </Typography>
                        <Box sx={{ flex: 1, minHeight: 300 }}>
                            <ReactECharts option={gaugeChartOption} style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
                            Department Performance
                        </Typography>
                        <Box sx={{ flex: 1, minHeight: 300 }}>
                            <ReactECharts option={horizontalBarOption} style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TestReport;


const Dropdown = () => {
    const [show, setShow] = useState(false)
    const parent = useRef(null)

    useEffect(() => {
        parent.current && autoAnimate(parent.current)
    }, [parent])

    const reveal = () => setShow(!show)

    return <div ref={parent}>
        <strong className="dropdown-label" onClick={reveal}>Click me to open!</strong>
        {show && <p className="dropdown-content" >Lorum ipsum...</p>}
    </div>
}

/**
 * Created by lenovo on 2017/7/30.
 */


$(document).ready(function () {
    bindCreateStudent();
    bindCreateCourse();
});

function bindCreateStudent() {
    var myChart = echarts.init(document.getElementById('my_student'));

    var option = {
        color: ['#3398DB'],
        title: {
            text: '我的学员'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['学员总数', '在学中', '毕业', '休学', '其它'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                name: '学员人数'
            }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '40%',
                data: []
            }
        ]
    };

    $.ajax({
        url: '',
        type: 'POST',
        dataType: 'json',
        data: {
            chartType: 'student',
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
        },
        success: function (response) {
            if (response.status) {
                option.series[0]['data'] = response.result;

                myChart.setOption(option);
            } else {
                
            }
        }
    });

    myChart.on('click', function (param) {
        switch (param.dataIndex) {
            case 0:
                window.location.href = 'http://127.0.0.1:8000/mentor/students.html';
                break;
            case 1:
                window.location.href = 'http://127.0.0.1:8000/mentor/students.html?study_status=0';
                break;
            case 2:
                window.location.href = 'http://127.0.0.1:8000/mentor/students.html?study_status=2';
                break;
            case 3:
                window.location.href = 'http://127.0.0.1:8000/mentor/students.html?study_status=1';
                break;
            case 4:
                window.location.href = 'http://127.0.0.1:8000/mentor/students.html?study_status=3';
                break;
            default:
                break
        }
    });
}

function bindCreateCourse() {
    var myChart = echarts.init(document.getElementById('my_course'));

    var option = {
        color: ['#3398DB'],
        title: {
            text: '学员各模块在线学习状况'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: true
                },
                splitNumber: 15
            }
        ],
        yAxis: [
            {
                name: '学员人数',
                type: 'value',
                max: 10,
                interval: 2
            }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '25%',
                data: []
            }
        ]
    };

    $.ajax({
        url: '',
        type: 'POST',
        dataType: 'json',
        data: {
            chartType: 'chapter',
            DegreeCourse: "1",
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
        },
        success: function (response) {
            // response 包含 X轴坐标以及数据
            var courseList = [];
            var courseNum = [];
            $.each(response.result, function (k, v) {
                courseList.push(k);
                courseNum.push(v);
            });
            option.xAxis[0]['data'] = courseList;
            option.series[0]['data'] = courseNum;

            myChart.setOption(option);
        }
    });

    myChart.on('click', function (param) {
        console.log(param.dataIndex);
        switch (param.dataIndex) {
            case 0:
                // window.location.href = 'https://www.baidu.com/';
                break;
            default:
                break;
        }
    })
}


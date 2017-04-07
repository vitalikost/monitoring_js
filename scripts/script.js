/**
 * Created by ostrovskij on 10.03.2017.
 */
var timer_t;
var index_p=0;


document.getElementById("botton_connect").addEventListener('click',function () {

    var url=document.getElementById("ip_server").value;
    get(url+"/whatareyou").then(function (result) {
        var str = result;
        var el = document.getElementById("Result_connect");
        el.innerHTML = str.replace(/\n\r/g,'<br>');
        el.style.color="green";
        //активируем тогда когда наш сервер поддержывает катие каоманды
        if(result.indexOf('temperature - Degrees Celsius')>0){
            document.getElementById("Settings_monitoring").style.display="";
            document.getElementById("Result_monitoring").style.display="";
        }
      }).catch(function (result) {
        var el = document.getElementById("Result_connect");
        el.textContent = "Error connect";
        el.style.color="red";
        document.getElementById("Settings_monitoring").style.display="none";
        document.getElementById("Result_monitoring").style.display="none";
    });


});

document.getElementById("start_timer").addEventListener("click",function () {
    var interval  =  document.getElementById("timer_interval").value;
    document.getElementById("status_timer").innerHTML="Таймер активный,интервал "+interval+" сек.";
        get_data();
        timer_t = setInterval(get_data,interval*1000);
})

document.getElementById("stop_timer").addEventListener("click",function () {
    clearInterval(timer_t);
    document.getElementById("status_timer").innerHTML="";
})

/*
var timer1 = setInterval(function () {
    get("http://127.0.0.1:3000/temperature").then(function (result) {
        var test = document.createElement('p');
        test.innerText = result;
        document.body.appendChild(test);

    })
},30*1000);

var timer2 = setInterval(function () {
    get("http://127.0.0.1:3000/humidity").then(function (result) {
        var test = document.createElement('p');
        //test.innerText= new  Date()+ " bmp085 "+result;
        test.innerText = result;
        document.body.appendChild(test);
    })
},30*1000);
*/

document.getElementById("create_chart").addEventListener("click",function () {
    document.getElementById("Chart").style.display="";
    create_chart();
})

window.onload = function() {}


function get(url) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req.response);
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
            }
        };

        // Handle network errors
        req.onerror = function() {
            reject(Error("Network Error"));
        };

        // Make the request
        req.send();
    });
}

document.getElementById("clear_table").addEventListener("click",function () {
    var table = document.getElementById("table_monitoring");
    while (table.rows.length>1){
        table.deleteRow(1);
    }
    index_p=0;
    document.getElementById("Chart").style.display="none";
})

function create_chart() {

    var lineChartData = {
        labels:[],
        datasets:[]
    };

    var labels= [];
    var dataChart=[];

    var table = document.getElementById("table_monitoring");
    for(var i=1;i<table.rows.length;i++)
    {
        var elment={};
       // labels.push(new Date(table.rows[i].cells[1].innerHTML+" "+table.rows[i].cells[2].innerHTML))  ;
        labels.push(table.rows[i].cells[1].innerHTML+" "+table.rows[i].cells[2].innerHTML)  ;
        dataChart.push(Number(table.rows[i].cells[3].innerHTML)) ;
    }

    lineChartData.labels=labels;

    var data={
        label: "температура гр. Сельсия",
        borderColor: window.chartColors.blue,
        backgroundColor: window.chartColors.blue,
        fill: false,
        data: dataChart,
        yAxisID: "y-axis-1",
    };
    lineChartData.datasets.push(data);

    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = Chart.Line(ctx, {
        data: lineChartData,
        options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title:{
                display: true,
                text:'Температура'
            },
            scales: {
                yAxes: [{
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                }],
            }
        }
    });

  }

document.getElementById("visibility_table").addEventListener("click",function () {
    var table = document.getElementById("table_monitoring");
    if (table.style.display === "none")
    {
        table.style.display ="";
    }
    else
    {
        table.style.display ="none";
    }

})

function get_data() {
    var url=document.getElementById("ip_server").value;
    get(url+"/temperature").then(function (result) {
        // console.log(result);
        index_p++;
        time = new  Date();
        newrow= document.getElementById("table_monitoring").insertRow();
        newcell=newrow.insertCell(0); //вставляем ячейку с индексом 0
        newcell.innerHTML=index_p;
        newcell.align="center";
        newcell=newrow.insertCell(1);
        newcell.innerHTML=time.getFullYear().toString().concat(".",(time.getMonth()+1),".",time.getDate());
        newcell=newrow.insertCell(2);
        newcell.innerHTML=((time.getHours()<10)?"0"+time.getHours():time.getHours().toString()).concat(":",((time.getMinutes()<10)?"0"+time.getMinutes():time.getMinutes()),":",
            (time.getSeconds()<10)?"0"+time.getSeconds():time.getSeconds());
        newcell=newrow.insertCell(3);
        newcell.innerHTML=result.replace("Temperature:","");
        newcell.align="right";

    });

    if (document.getElementById("online_chart").checked===true)
    {
        create_chart();
    }

    var limit =document.getElementById("limit_count").value;  
    if(limit>0)
    {
        if(document.getElementById("table_monitoring").rows.length>=limit)
        {
            clearInterval(timer_t);
            document.getElementById("status_timer").innerHTML="Выполнено "+limit +" кво.";
        }
    }  

}
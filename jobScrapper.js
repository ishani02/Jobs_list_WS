let url="https://www.freshersworld.com/jobs/jobsearch/it-software-engineer-jobs-for-be-btech-in-delhi?course=16";
let request=require("request");
let cheerio=require("cheerio");
let fs = require("fs");
const reader = require('xlsx');
const file=reader.readFile("test.xlsx");

let finalObj=[];
request(url,cb);
function cb(error,response,html){
    if(error){
        console.log("Error");
    }else if(response.statusCode==404){
        console.log("Page Not Found");
    }else{
        dataExtracter(html);
    }
}
function dataExtracter(html){//To extract jobs list from freshersworld
  let searchTool=cheerio.load(html);
  let jobs=searchTool('.job-container.jobs-on-hover')
  
  for(let i=0;i<jobs.length;i++){
    let job=searchTool(jobs[i]);
    let jobName=searchTool(job).find("h3").text();
    let post=searchTool(job).find(".col-md-12.col-xs-12.col-lg-12.padding-none.left_move_up div");
    let postDetail=searchTool(post[0]).text();
    let qualification=searchTool(job).find(".col-md-12.col-xs-12.col-lg-12.padding-none.left_move_up div.qualification-block").text();
    let description=searchTool(job).find(".col-md-12.col-xs-12.col-lg-12.padding-none.margin-top span.desc").text().trim();
    let place=searchTool(job).find(".col-md-9.col-xs-9.col-lg-9.padding-none.padding-top-5 a.bold_font").text();
    let lastDate=searchTool(job).find("span.padding-left-4").text();
    let experience=searchTool(job).find("span.experience").text();
    
    let obj={
      "Company Name":jobName,
      "Post":postDetail,
      "Qualifiction":qualification,
      "Description":description,
      "Location":place,
      "Last Date":lastDate,
      "Experience":experience
    }
     finalObj.push(obj);
  }
    //to create excel file
    const ws=reader.utils.json_to_sheet(finalObj);
    reader.utils.book_append_sheet(file,ws,"sheet1");
    reader.writeFile(file,"freshersworld.xlsx")
     //fs.appendFileSync("jobs.json",JSON.stringify(finalObj));
}

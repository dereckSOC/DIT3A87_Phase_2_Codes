async function countApi(url) {
	const host = "https://api.countapi.xyz"
	try {
		return await axios.get(host + url);
	} catch (err) {
		console.log('error', err)
	}
}

function createHTML(rs) {
    //format inputs

    console.log(rs)
    var id = rs._id;
    var author_id = rs.author.id._id;
    var auther_id_img = rs.author.id.image;
    var first_name = rs.author.id.firstName;
    var last_name = rs.author.id.lastName;
    var date = moment(rs.createdAt).fromNow();

    var likes = rs.likes.length;
    var thumbnail = rs.thumbnail;
    var listing_name = rs.name;
    var location = rs.location;
    var price = rs.price;
    var bedrooms = rs.bedrooms;
    var bathrooms = rs.bathrooms;
    var size = rs.size;
    var district = rs.district;
    var type= rs.type;
    var tenure = rs.tenure;
  
    //Listing Name
    if(listing_name.length<14){
        listing_name = listing_name.substring(0, 14);
    } else {
        listing_name = listing_name.substring(0, 14) + "...";
    }

    //Listing location
    if(location.length<25){
        location = location.substring(0, 25);
    } else {
        location = location.substring(0, 25) + "...";
    }

    //Listing tenure
    if (tenure.length<5){
        tenure = tenure.substring(0, 5)
    } else {
        tenure = tenure.substring(0, 5) + "..."
    }

    //if sold/archive
    var insertSoldArchive = "";
    
    if (rs.soldStatus == true) {
        insertSoldArchive = `<div class="col-md-12 m-0 p-0 justify-content-center d-flex">
                        <span class="text-center" id="soldBanner-list">
                            Sold
                        </span>
                    </div>`
    } else if (rs.archiveStatus==true) {
        insertSoldArchive = ` <div class="col-md-12 m-0 p-0 justify-content-center d-flex">
                                <span class="text-center" id="archiveBanner-list">
                                    Archived
                                </span>
                            </div>`
    }

    //if like/unlike
    var insertLikeUnlike = "";
    if (currentUser && rs.likes.some(function (like) { return like == (currentUser._id) })) {
        insertLikeUnlike = `<button class="p-0" id="filledHeart">
                                <i class="fas fa-heart filledHeart"></i>
                                ` + likes +  `
                            </button>`
    } else {
        insertLikeUnlike = `<button class="p-0" id="emptyHeart">
                                <i class="far fa-heart emptyHeart"></i>
                            ` + likes + `
                            </button>`
    }

    //if admin
    var insertManageListStart = "";
    var listArchiveSold = "";
    var listUnArchive = "";
    var listMarkAvail = "";
    var insertManageListEnd = ""
    
    countApi("/hit/3dpropertylistingsg/" +  id + "-click");

    if(currentUser&&(author_id == currentUser._id)||currentUser&&currentUser.isAdmin) {
        insertManageListStart =  `<div class="dropdown">
                                    <button type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="background-color: transparent; border: none">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" href="/listings/` + id + `/edit">
                                            Edit
                                        </a>`

                if(rs.archiveStatus==false && rs.soldStatus==false){
                    listArchiveSold = `<a class="dropdown-item" href="/listings/` + id + `/archive">
                                        Archive
                                    </a>
                                    <a class="dropdown-item" href="/listings/` + id + `/sold">
                                        Mark as Sold
                                    </a>`
                } else if (rs.archiveStatus==true && rs.soldStatus==false) {
                    listUnArchive = `<a class="dropdown-item" href="/listings/` + id + `/unarchive">
                                        Unarchive
                                    </a>`
                } else {
                    listMarkAvail = `<a class="dropdown-item" href="/listings/` + id + `/unsold">
                        Mark as Available
                    </a>`
                }

                insertManageListEnd =  `</div>
                                    </div>`
    }

    var html = `<div class="col-md-12 m-0 p-0" data-aos="fade-up" data-aos-once="true">
                    <div class="listingHoverMain" style="display: flex; align-items: center; justify-content: center; flex-direction: column; margin: 10px; transition: 0.3s; " >
                        <div class="row col-md-12">

                            ` + insertSoldArchive + `

                            <div class="row col-md-12 m-0 d-flex justify-content-between align-items-center" style="padding: 0 0 10px 0;">
                                <div class="d-flex flex-direction-row align-items-center justify-content-center" style="font-size: 15px; cursor: pointer; " onClick=" window.location='/user/` + author_id + `'">
                                    <img src="` + auther_id_img + `" style="width:35px; height:35px ;border-radius: 50%; margin: auto;object-fit: cover;">
                                    <div class="d-flex flex-column" style="margin-left: 10px;">
                                        <div class="d-flex flex-direction-row">
                                            ` + first_name + `
                                            ` + last_name + `
                                        </div>
                                        <div style="font-size: 12px;">
                                            ` + date + `
                                        </div>
                                    </div>
                                </div>
                
                                <div class="d-flex flex-direction-row">
                                    <div class="d-flex align-items-center justify-content-end">
                                        <form action="/listings/` + id + `/like" method="POST" class="likeBtn">
                                            <div>
                                                ` + insertLikeUnlike + `
                                            </div>
                                        </form>
                                    </div>

                                    ` + insertManageListStart + `
                                    ` + listArchiveSold + `
                                    ` + listUnArchive + `
                                    ` + listMarkAvail + `
                                    ` + insertManageListEnd + `
                                    
        
                                </div>
                            </div>

                            <!--Left of Listing-->
                            <div class="col-sm-4 col-md-4 p-0 m-0 list-left d-flex justify-content-center align-items-center ">
                                <a class="p-0 m-0" href="/listings/` + id + `" style="text-decoration: none; color: black">
                                    <img class="img-fluid shadow" src="` + thumbnail +`" style="width: 100%; height: 130px; object-fit: cover; text-align: center">
                                </a>
                            </div>

                            <!--Right of Listing-->
                            <div class="col-sm-8 col-md-8 list-right" > 
                                <a href="/listings/` + id + `" style="text-decoration: none; color: black;">       
                                    <!--Name-->
                                    <div class="col-12 listing-detail d-flex justify-content-between" id="listing-name" >

                                        ` + listing_name + `

                                    </div>
                                    <!--Street-->
                                    <div class="col-12 listing-detail" id="listing-street">

                                        ` + location + `

                                    </div>
                                    <!--Price-->
                                    <div class="col-12 listing-detail" id="listing-price">
                                        <p style="margin-bottom: 0">S$ </p>

                                        <span>` + price + `</span>
                                        
                                    </div>
                                    <!--Property Details-->
                                    <div class="col-md-12 align-items-center d-flex">
                                        <div class="left">
                                            <span>`+ bedrooms +`</span>
                                            <img class="pl-1" src="/img/bed-solid-svgrepo-com.svg" alt="" style="width:26px!important;">
                                        </div>

                                        <div class="left right">
                                            <span>`+ bathrooms +`</span>
                                            <img class="pl-1" src="/img/wc-toilet-svgrepo-com.svg" alt="" style="width:20px!important;">
                                        </div>

                                        <div class="left right">
                                            <i style="font-size:0.26em!important;" class="fas fa-circle"></i>
                                        </div>

                                        <div class="right">
                                            <span>`+ size +` sqft</span>
                                        </div>
                                    </div>
                                    <!--Tags-->
                                    <div class="col-md-12"> 
                                        <div class="left pt-2 pb-1">
                                            <span class="px-3 py-0" style="color: #4632DA; border: 1px solid #4632DA;">
                                                    `+ district +`
                                            </span>
                                        </div>
                                        <div class="left right pt-2 pb-1">
                                            <span class="px-3 py-0" style="color: #4632DA; border: 1px solid #4632DA;">
                                                    `+ type +`
                                            </span>
                                        </div>
                                        <div class="left right pt-2 pb-1">
                                            <span class="px-3 py-0" style="color: #4632DA; border: 1px solid #4632DA;">
                                                    `+ tenure +`
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`
    return html;
}

function loadData (rs,loadObj) {
    //loadObj
    var totalRem = loadObj.totalRem;
    var sectionRem = loadObj.sectionRem;
    var remainList = loadObj.remainList;
    var startIndex = loadObj.startIndex;
    var endIndex;

    //loads all data
    var insertDiv = document.getElementById("loadProperty");
    var i;

    if (sectionRem == 0) {
        endIndex = startIndex + remainList ;
        //remaining minus 5 (as it has already been loaded)
        loadObj.totalRem = 0;
        //section minus 1 (as it has already been loaded)
        loadObj.sectionRem = 0;
        //remainList remains the same
        loadObj.remainList = 0;
        //end index becomes start index
        loadObj.startIndex = 0;
    } else {
        endIndex = startIndex + 5;
    }

    for (i = startIndex; i < endIndex; i++) {
        var html = createHTML(rs[i]);
        insertDiv.insertAdjacentHTML("beforeend", html);
    }

     //update object
    //if section is not done
    if (sectionRem != 0) {
        loadObj.totalRem = loadObj.totalRem - 5;
        loadObj.sectionRem = loadObj.sectionRem - 1;
        loadObj.startIndex = endIndex;
    } else {
        loadObj.totalRem = loadObj.remainList;
        loadObj.sectionRem = 0;
        loadObj.startIndex = endIndex;
        document.getElementById("loadMoreBtn").remove();
        var finalMsg = `<p id="endOfResult">End of Search Result</p>`
        try {
            document.getElementById("loadMoreDiv").insertAdjacentHTML("beforeend", finalMsg);
        } catch(e){}
        
    }

    return loadObj;
}

function loadFirstFive(rs) {
    var resultSet = rs;
    var rsLength = resultSet.length;
    var loadObj;

    //divide into different sections
    var section = Math.floor(parseInt(rsLength,10) / 5); //number of sections (1 section, 10 listings)
    // var remSect = parseInt(rsLength,10) % 5; //number of listings remaining
    var remSect = rsLength - (section * 5);

    var loadObj = {
        "totalRem" : rsLength,
        "sectionRem" : section,
        "remainList" : remSect,
        "startIndex" : 0,
    }


    loadObj = loadData(rs,loadObj);
    return loadObj;
}
var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var User = require("../models/user");

//Get Route
router.get("/admin-dashboard", function(req,res){
	res.render("dashboards/admin/index.ejs");
});

//Get Route
router.get("/admin-dashboard/agent", function(req,res){
	User.find({}, function(err, allUsers){
		if(err){
			console.log(err);
		} else{
			res.render("dashboards/admin/agent.ejs", {users:allUsers});
		}
	});
});

//Get Route
router.get("/admin-dashboard/public", function(req,res){
	User.find({}, function(err, allUsers){
		if(err){
			console.log(err);
		} else{
			res.render("dashboards/admin/public.ejs", {users:allUsers});
		}
	});
});

//Show Route
router.get("/admin-dashboard/agent/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			res.redirect("/listings");
		} else{
			res.render("dashboards/admin/show.ejs", {user: foundUser});
		}
	});
});

//Edit Route
router.get("/admin-dashboard/agent/:id/edit", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			res.redirect("/listings");
		} else{
			res.render("dashboards/admin/edit.ejs", {user: foundUser});
		}
	});
});

//Update Route
router.put("/admin-dashboard/agent/:id", function(req, res){
//can straight away use req.body.listing without having to define due to "listing[]" in the form name attributes
	User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
		if(err){
			res.redirect("/listings");
		} else{
			res.redirect("/admin-dashboard/agent/" + req.params.id);
		}
	});
});

module.exports = router;
﻿"use strict";
var tid = setInterval(function () {
    if ("complete" === document.readyState) {
        clearInterval(tid);
        var a = document.querySelector.bind(document),
            b = document.querySelector(".vertical_nav"),
            c = document.querySelector(".wrapper2"),
            d = document.getElementById("js-menu"),
            e = d.querySelectorAll(".menu--item__has_sub_menu");
        a(".toggle_menu").onclick = function () {
            b.classList.toggle("vertical_nav__opened"), c.classList.toggle("toggle-content")
        }, a(".collapse_menu").onclick = function () {
            b.classList.toggle("vertical_nav__minify"), c.classList.toggle("wrapper__minify");
            for (var a = 0; a < e.length; a++) e[a].classList.remove("menu--subitens__opened")
        };
        for (var f = 0; f < e.length; f++) e[f].classList.contains("menu--item__has_sub_menu") && e[f].addEventListener("click", function (a) {
            a.preventDefault();
            for (var b = 0; b < e.length; b++) this != e[b] && e[b].classList.remove("menu--subitens__opened");
            this.classList.toggle("menu--subitens__opened")
        }, !1); 
    }
}, 100);




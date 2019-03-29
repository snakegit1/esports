import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor() { }

	ngOnInit() {
		$(document).ready(function () {
			let eTop = $('.section-2').offset().top - 54;
			setClassNavBar();
			getScrollNav();
			$(window).on('resize scroll', function () {
				setClassNavBar();
				getScrollNav();
				if ($(window).width() > 995) {
					$('.btn-navbar-menu').removeClass('active');
					$('body').removeClass('dscroll');
				}
			})
		
			function setClassNavBar() {
				let onTopBar = eTop - $(window).scrollTop();
				if (onTopBar <= 0) {
					$('.nav-bar').addClass('ontop');
				} else {
					$('.nav-bar').removeClass('ontop');
				}
			}
		
			function getScrollNav() {
				let $sections = $('section');
				$sections.each(function (i, el) {
					let top = $(el).offset().top - 100;
					let bottom = top + $(el).height();
					let scroll = $(window).scrollTop();
					let id = $(el).attr('id');
					if (scroll > top && scroll < bottom) {
						$('.nav-bar a.active').removeClass('active');
						if (id !== 'anchor0' && id !== undefined) {
								$('.nav-bar a[href="#' + id + '"]').addClass('active');
						}
					}
				})
			}
		
			$(".nav-bar, .btn-navbar-menu").on("click", "a", function (event) {
				$('.btn-navbar-menu').removeClass('active');
				if( !$(this).hasClass('nav-link') ) {
					$('body').removeClass('dscroll');
						event.preventDefault();
						let id = $(this).attr('href');
						let top = $(id).offset().top;
					$('body,html').animate({ scrollTop: top }, 800);
					//$('body,html').scrollTop(top) ;
				}
			});
		
			$('.btn-navbar').on('click', function () {
				$('.btn-navbar-menu').addClass('active');
				$('body').addClass('dscroll');
			})
		
			$('.closer').on('click', function () {
				$('.btn-navbar-menu').removeClass('active');
				$('body').removeClass('dscroll');
			})
		
		});

	}

}

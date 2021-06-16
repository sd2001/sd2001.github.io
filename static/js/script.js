const mouseCircle = document.querySelector(".mouse-circle");
const mouseDot = document.querySelector(".mouse-dot");


const circles = document.querySelectorAll('.circles');
const mainimg = document.querySelector(".main-circle img");

let mx = 0;
let my = 0;
let mousecirclebool = true;

var myVar;

function myFunction() {
	myVar = setTimeout(showPage, 3000);
}

function showPage() {
	document.getElementById("loader-container").style.display = "none";
	document.getElementById("container").style.display = "block";
}

// var docWidth = document.documentElement.offsetWidth;

// var all = document.getElementsByTagName("*"), i = 0, rect, docWidth = document.documentElement.offsetWidth;
// for (; i < all.length; i++) {
// 	rect = all[i].getBoundingClientRect();
// 	if (rect.right > docWidth || rect.left < 0) {
// 		console.log(all[i]);
// 		all[i].style.border = '1px solid green';
// 	}
// }

const animatecircles = (e, x, y) => {
	if (x > mx) {
		// console.log("LEft")
		circles.forEach(circle => {
			circle.style.left = `70px`;
		});
		mainimg.style.left = `60px`;
	}
	else if (x < mx) {
		circles.forEach(circle => {
			circle.style.left = `-70px`;
		})
		mainimg.style.left = `-60px`;
	}
	if (y > mx) {
		circles.forEach(circle => {
			circle.style.top = `70px`;
		})
		mainimg.style.top = `60px`;
	}
	else if (y < mx) {
		circles.forEach(circle => {
			circle.style.top = `-70px`;
		})
		mainimg.style.top = `-60px`;
	}


	mx = e.clientX;
	my = e.clientY;
};

const mouseCircleFn = (x, y) => {
	if (mousecirclebool) {
		mouseCircle.style.cssText = `top: ${y}px; left: ${x}px; opacity: 1;`;

	}
	// mouseCircle.style.cssText = "opacity: 1;"
	mouseDot.style.cssText = `top: ${y}px; left: ${x}px;
	opacity: 1;`;
};

let hoverpos = [];
document.body.addEventListener('mousemove', (e) => {
	let x = e.clientX;
	let y = e.clientY;
	mouseCircleFn(x, y);
	animatecircles(e, x, y);


	const hoveredElements = document.elementFromPoint(x, y)
	mouseCircleTransform(hoveredElements);

	if (hoveredElements.classList.contains("sticky")) {
		if (hoverpos.length < 1) {
			hoverpos = [hoveredElements.offsetTop, hoveredElements.offsetLeft]
		}
		hoveredElements.style.cssText = `top: ${y}px; left: ${x}px;`;

		if (hoveredElements.offsetTop <= hoverpos[0] - 100 || hoveredElements.offsetTop >= hoverpos[0] + 100 || hoveredElements.offsetLeft >= hoverpos[1] + 100 || hoveredElements.offsetLeft <= hoverpos[1] - 100) {
			hoveredElements.style.cssText = "";
			hoverpos = []
		}

		hoveredElements.onmouseleave = () => {
			hoveredElements.style.cssText = "";
			hoverpos = []
		}
	}
});

document.body.addEventListener('mouseleave', () => {
	mouseCircle.style.opacity = '0';
	mouseDot.style.opacity = '0';
});

// MOUSE HOVER TRANSITION



const mouseCircleTransform = (hovE) => {
	if (hovE.classList.contains('enter')) {
		hovE.onmousemove = () => {
			mousecirclebool = false;
			mouseCircle.style.cssText = `width: ${hovE.getBoundingClientRect().width}px;
			height: ${hovE.getBoundingClientRect().height}px;
			top: ${hovE.getBoundingClientRect().top}px;
			left: ${hovE.getBoundingClientRect().left}px;
			opacity: 1;
			transform: translate(0,0);
			animation: none;
			border-radius: ${getComputedStyle(hovE).borderBottomLeftRadius};
			transition: width 0.5s, height 0.5s, top 0.5s, left 0.5s, transform 0.5s, border-radius 0.5s;`;
		}
		hovE.onmouseleave = () => {
			mousecirclebool = true;
		}
		document.onscroll = () => {
			if (!mousecirclebool || hovE.style.opacity == 0) {
				mouseCircle.style.top = `${hovE.getBoundingClientRect().top}px`;

			}
		}
	}
}

// NAVIGATION

const menuicon = document.querySelector('.menu-icon')
const navbar = document.querySelector('.navbar')

document.addEventListener('scroll', () => {
	menuicon.classList.add('show-menu');
	navbar.classList.add('hide-navbar');

	if (window.scrollY === 0) {
		menuicon.classList.remove('show-menu');
		navbar.classList.remove('hide-navbar');
	}

	progressbarfn();
});

menuicon.addEventListener('click', () => {
	menuicon.classList.remove('show-menu');
	navbar.classList.remove('hide-navbar');
})


const mainbtn = document.querySelector('.main-btn');

mainbtn.addEventListener('mouseenter', (e) => {
	const left = e.clientX - e.target.getBoundingClientRect().left;
	const top = e.clientY - e.target.getBoundingClientRect().top;
	// console.log('Woooo')
	ripple = document.createElement('div');
	ripple.classList.add('ripple');
	ripple.style.left = `${left}px`;
	ripple.style.top = `${top}px`;
	mainbtn.prepend(ripple);

});

mainbtn.addEventListener('mouseleave', (e) => {
	mainbtn.removeChild(ripple);
});

// About ME

let projects = document.querySelectorAll('.card');
projects.forEach((project, i) => {
	if (i >= 6) {
		project.style.cssText = "display: none; opacity: 0;"
	}
});

document.body.addEventListener('mouseleave', () => {
	mouseCircle.style.opacity = '0';
	mouseDot.style.opacity = '0';
});

const pbtn = document.querySelector('.projects-btn');
const pbtntxt = document.querySelector('.projects-btn span');

pbtn.addEventListener('mouseenter', (e) => {
	e.preventDefault();
	const left = e.clientX - e.target.getBoundingClientRect().left;
	const top = e.clientY - e.target.getBoundingClientRect().top;
	// console.log('Woooo')
	ripple = document.createElement('div');
	ripple.classList.add('ripple');
	ripple.style.left = `${left}px`;
	ripple.style.top = `${top}px`;
	pbtn.prepend(ripple);

});
// pbtn.classList.add("change")
pbtn.addEventListener("mouseleave", (e) => {
	e.preventDefault();
	pbtn.removeChild(ripple);
});
let show = true;
const showprojects = (project, i) => {
	setTimeout(() => {
		var projectimg = project.getElementsByTagName('img')[0].src;
		console.log(projectimg);
		project.style.cssText = `background-image: url(${projectimg});`;
		project.style.display = 'flex';
	}, 600);
	setTimeout(() => {
		project.style.opacity = '1';
	}, i * 150);
}

const hideprojects = (project, i) => {
	setTimeout(() => {
		project.style.display = 'none';
	}, 1200);
	setTimeout(() => {
		project.style.opacity = '0';
	}, i * 100);
}

pbtn.addEventListener('click', (e) => {
	e.preventDefault();
	pbtn.firstElementChild.nextElementSibling.classList.toggle("change");
	let projects = document.querySelectorAll('.card');

	projects.forEach((project, i) => {
		if (i >= 6) {
			if (show) {
				showprojects(project, i);
				pbtntxt.textContent = 'Show Less';

			}
			else {
				hideprojects(project, i);
				pbtntxt.textContent = 'Show More';
			}
		}
	});

	show = !show;
});

const formHeading = document.querySelector(".section5-header");
const formInputs = document.querySelectorAll(".contact-form-input")

formInputs.forEach((input) => {
	input.addEventListener("focus", () => {
		formHeading.style.opacity = "0";
		setTimeout(() => {
			formHeading.textContent = `Your ${input.placeholder}`;
			formHeading.style.opacity = "1"
		}, 300);
	});
	input.addEventListener("blur", () => {
		formHeading.style.opacity = "0";
		setTimeout(() => {
			formHeading.textContent = "Let's Talk";
			formHeading.style.opacity = "1"
		}, 300);
	});
})

const slideshow = document.querySelector('.slideshow');

setInterval(() => {
	const first = slideshow.firstElementChild;

	first.classList.add("faded-out");

	setTimeout(() => {
		slideshow.removeChild(first);
		slideshow.appendChild(first);

		setTimeout(() => {
			first.classList.remove("faded-out");
		}, 300);
	}, 300);

}, 3000);

const sections = document.querySelectorAll("section")
const pb = document.querySelector('.progress-bar')
const halfcircle = document.querySelectorAll('.half-circle');
const halfcircletop = document.querySelector('.half-circle-top');

const progressbar = document.querySelector('.progress-bar-circle');

const progressbarfn = () => {
	const pagevht = window.innerHeight;
	const pageht = document.documentElement.scrollHeight;
	const scrolledportion = window.pageYOffset;

	const scrolldegree = (scrolledportion / (pageht - pagevht)) * 360;

	halfcircle.forEach((el) => {
		el.style.transform = `rotate(${scrolldegree}deg)`;
	})

	if (scrolldegree >= 180) {
		halfcircle[0].style.transform = "rotate(180deg)";
		halfcircletop.style.opacity = "0";
	}
	else {
		halfcircletop.style.opacity = "1";
	}

	const scrollbool = scrolledportion + pagevht + 10 >= pageht;
	// Click EVENTS
	pb.onclick = e => {
		e.preventDefault();


		const sectionpos = Array.from(sections).map((section) => scrolledportion + section.getBoundingClientRect().top
		);

		const pos = sectionpos.find(secp => sectionpos > scrolledportion)

		scrollbool ? window.scrollTo(0, 0) : window.scrollTo(0, pos)
	}

	if (scrolledportion + pagevht + 10 >= pageht) {
		progressbar.style.transform = "rotate(180deg)";
	}
	else {
		progressbar.style.transform = "rotate(0)";
	}

};


progressbarfn();
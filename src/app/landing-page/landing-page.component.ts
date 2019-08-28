import { Component, OnInit } from "@angular/core";
import { AuthService } from "../Auth/services/auth.service";
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { Title } from "@angular/platform-browser";

declare var $: any;

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.css"]
})
export class LandingPageComponent implements OnInit {
  news: any = [];
  bdImages = [
    "../../assets/img/BD/photo_2019-08-19_06-08-32.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-10.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-23.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-28.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-33.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-37.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-41.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-45.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-50.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-09-55.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-10-01.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-10-05.jpg",
    "../../assets/img/BD/photo_2019-08-19_06-10-09.jpg"
  ];

  mekeleImages = [
    "../../assets/img/Mekele/photo_2019-08-19_06-18-32.jpg",
    "../../assets/img/Mekele/photo_2019-08-19_06-19-01.jpg",
    "../../assets/img/Mekele/photo_2019-08-19_06-22-32.jpg",
    "../../assets/img/Mekele/photo_2019-08-19_06-22-41.jpg",
    "../../assets/img/Mekele/photo_2019-08-19_06-19-24.jpg",
    "../../assets/img/Mekele/photo_2019-08-19_06-19-16.jpg",
    "../../assets/img/Mekele/photo_2019-08-19_06-19-08.jpg"
  ];

  juImages = [
    "../../assets/img/JU/photo_2019-08-19_06-14-38.jpg",
    "../../assets/img/JU/photo_2019-08-19_06-15-12.jpg",
    "../../assets/img/JU/photo_2019-08-19_06-15-17.jpg",
    "../../assets/img/JU/photo_2019-08-19_06-15-24.jpg"
  ];
  jacpImages = [
    "../../assets/img/J.A.C.P/IMG_6303.JPG",
    "../../assets/img/J.A.C.P/IMG_6305.JPG",
    "../../assets/img/J.A.C.P/IMG_6306.JPG",
    "../../assets/img/J.A.C.P/IMG_6308.JPG",
    "../../assets/img/J.A.C.P/IMG_6310.JPG",
    "../../assets/img/J.A.C.P/IMG_6311.JPG",
    "../../assets/img/J.A.C.P/IMG_6312.JPG",
    "../../assets/img/J.A.C.P/IMG_6313.JPG",
    "../../assets/img/J.A.C.P/IMG_6314.JPG",
    "../../assets/img/J.A.C.P/IMG_6315.JPG"
  ];
  archiveImages = {
    bdImages: this.bdImages,
    mekeleImages: this.mekeleImages,
    juImages: this.juImages,
    jacpImages: this.jacpImages
  };
  mySlideOptions = { items: 1, dots: true, nav: false };

  choosenArchive = {
    title: "",
    images: this.archiveImages.bdImages
  };

  constructor(
    public authService: AuthService,
    public router: Router,
    public http: Http
  ) {}

  ngOnInit() {}

  toggleMenu() {
    if ($("#menus").css("display") === "none") {
      $("#menus").css("display", "block");
      $("#menus").css("background", "white");
    } else {
      $("#menus").css("display", "none");
    }
  }

  onViewArchive(title, images) {
    this.choosenArchive = {
      title: title,
      images: this.archiveImages[images]
    };
    $("#archive-modal").modal("show");
  }
}

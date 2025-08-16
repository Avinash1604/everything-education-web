import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject.model';

type SubjectCard = {
  key: string;
  title: string;
  image: string;      // optional: use your actual asset paths or illustration URLs
  comingSoon?: boolean;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  subjects: SubjectCard[] = [];

  constructor(
    private router: Router,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe((data: Subject[]) => {
      this.subjects = data.map(subject => ({
        key: subject.name.toLowerCase(),
        title: subject.name,
        image: `assets/subjects/${subject.name.toLowerCase()}.svg`,
        comingSoon: !subject.enabled
      }));
    });
  }

  openSubject(s: SubjectCard) {
    if (s.comingSoon) { return; }
    // Navigate to your route (update as per your routing setup)
    this.router.navigate(['/subjects', s.key]);
  }
}

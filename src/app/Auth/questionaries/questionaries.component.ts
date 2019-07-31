import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionaries',
  templateUrl: './questionaries.component.html',
  styleUrls: ['./questionaries.component.css']
})
export class QuestionariesComponent implements OnInit {

  public questions = {
    q1: {
      question: 'What kind of product are you going to develop for this competition?',
      options: [
        'Software (for Mobile Application)',
        'Software (for web Application)',
        'Software (for Desktop Application)',
        'Software (Industrial Application)',
        'Hardware',
        'SMS based applicatoin',
        'Hybride product (heavy both on Software and Hardware)',
        'Other'
      ]
    },
    q2: {
      question: 'Which sector best includes your product or product idea?',
      options: [
        'Agriculture and Fishery',
        'Health',
        'Education',
        'Finance',
        'Construction Industry',
        'Metallurgical Industry',
        'Transportation Sector',
        'Food and Beverage Processing',
        'Entertainment',
        'Tourism and Culture',
        'Other'
      ]
    },
    q3: {
      question: 'How would you describe your innovation (product or product idea) if you had to do so just in three Sentences?'
    },
    q4: {
      quesiton: 'What problem is your innovation solving?'
    },
    q5: {
      question: 'How does your innovation solve this problem?'
    },
    q6: {
      question: 'Why do you want to be a part of this competition?'
    },
    q7: {
      question: 'Why do you want to be a part of this competition?'
    },
    q8: {
      question: 'Do you want to compete in a team?'
    },
    q9: {
      question: 'Why?'
    },
    q10: {
      question: 'Do you want to compete as individual?'
    },
    q11: {
      question: 'Have you ever been involved in a competition before? ',
      options: [
        'Nes',
        'No'
      ]
    }
  };

  constructor() { }

  ngOnInit() {
  }

}

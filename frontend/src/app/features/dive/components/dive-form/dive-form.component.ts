import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/services/utils/modal.service';
import { DiveService } from '../../services/dive.service';
import { DateValidator } from '../../../../shared/validators/dateValidator';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { ActivatedRoute } from '@angular/router';
import { AnimationService } from '../../../../shared/services/utils/animation.service';

@Component({
  selector: 'app-dive-form',
  templateUrl: './dive-form.component.html',
  styleUrl: './dive-form.component.scss'
})
export class DiveFormComponent implements OnInit {

  addDiveForm!: FormGroup;
  divelogId!: number;
  
  isSubmitting = false;
  today: Date = new Date();

  isAnimatingFadeOut = false;

  constructor(
    private animationService: AnimationService,
    private formBuilder: FormBuilder, 
    private modalService: ModalService,
    private diveService: DiveService, 
    private flashMessageService: FlashMessageService,
    private route: ActivatedRoute
  ) {
    this.animationService.isAnimating$.subscribe((animating) => {
      this.isAnimatingFadeOut = animating;
    });
  }

  ngOnInit() {
    // Param :id est défini sur le parent (DivelogDetailPageComponent)
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        throw new Error('divelogId manquant dans l’URL');
      }
      this.divelogId = +id; // Convertit en nombre
      this.initForm();
    });
  }

  private initForm() {
    this.addDiveForm = this.formBuilder.group({
      // divelogId: [null, Validators.required], // pas dans le form (url param)
      title: ['', [Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      // diveDatetime: [null, [Validators.required, DateValidator.isValidDate]],
      // diveDuration: [null, [Validators.required, Validators.min(1), Validators.max(1440)]], // en minutes
      // weight: [null, [Validators.required, Validators.min(0), Validators.max(1000)]], // en kg
      // temperature: [null, [Validators.min(-50), Validators.max(50)]], // en °C
      // visibility: ['', [Validators.maxLength(100)]],
      // satisfaction: [null, [Validators.min(1), Validators.max(5)]], // de 1 à 5
      // tags: [[]] // tableau de chaînes de caractères
    });
  }


  onSubmit(): void {
  if (this.addDiveForm.valid) {
    this.isSubmitting = true;

    this.diveService.addDiveToUserDivelog({divelogId: this.divelogId, ...this.addDiveForm.value}).subscribe({
      next: (createdDive) => {
        console.log('Dive added successfully:', createdDive);
        this.flashMessageService.success('Plongée ajoutée avec succès !');
        this.isSubmitting = false;
        // redirect/nav Divelog ou redirect dive-details créée
      },
      error: (error:any) => {
        console.error('There was an error during the request (addCertificateToUser)', error);
        this.flashMessageService.error('Erreur lors de l\'ajout de la plongée. Veuillez réessayer.');
        this.isSubmitting = false;
      }
    });
  } else {
    console.error('Form is invalid');
  }
}
}

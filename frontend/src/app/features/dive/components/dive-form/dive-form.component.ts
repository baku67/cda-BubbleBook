import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiveService } from '../../services/dive.service';
import { DateValidator } from '../../../../shared/validators/dateValidator';
import { FlashMessageService } from '../../../../shared/services/utils/flash-message.service';
import { ActivatedRoute } from '@angular/router';
import { AnimationService } from '../../../../shared/services/utils/animation.service';
import { DiveOxygenMode } from '../../models/dive-oxygen-mode.enum';
import { DivelogStoreService } from '../../../divelog/services/divelog-detail-store.service';
import { filter } from 'rxjs';
import { DiveVisibility } from '../../models/dive-visibility.enum';

@Component({
  selector: 'app-dive-form',
  templateUrl: './dive-form.component.html',
  styleUrl: './dive-form.component.scss'
})
export class DiveFormComponent implements OnInit {

  addDiveForm!: FormGroup;

  divelogId!: number;
  divelogTitle!: string;
  today: Date = new Date();
  diveOxygenEnum = DiveOxygenMode;
  diveOxygenModes = Object.values(DiveOxygenMode);
  diveVisibility = DiveVisibility;
  diveVisibilityModes = Object.values(DiveVisibility);
  
  isSubmitting = false;
  isAnimatingFadeOut = false;

  constructor(
    private animationService: AnimationService,
    private formBuilder: FormBuilder, 
    private diveService: DiveService, 
    private flashMessageService: FlashMessageService,
    private route: ActivatedRoute,
    private divelogStore: DivelogStoreService,
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

    // Récupération du Divelog depuis le store (pour affichage titre,etc)
    this.divelogStore.divelog$
      .pipe(filter(divelog => !!divelog))
      .subscribe(divelog => {
        this.divelogTitle = divelog!.title;
      });
  }

  private initForm() {
    this.addDiveForm = this.formBuilder.group({
      infos: this.formBuilder.group({
        // divelogId: [null, Validators.required], // pas dans le form (url param)
        title: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        description: ['', [Validators.maxLength(500)]],
        // diveDatetime: [null, [Validators.required, DateValidator.isValidDate]],
        duration: [
          null,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(1440),
          ]
        ],
        maxDepth: [
          null,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(200),
          ]
        ],
        oxygenMode:   [null, Validators.required],
        oxygenMix:    [null], // à afficher uniquement si MIX
        safetyStop:   [true],
        weight:       [null, [Validators.required, Validators.min(0)]],

        temperature:  [null, [ Validators.min(-2), Validators.max(40)]],

        visibility:   [null], 
        // satisfaction: [null, [Validators.min(1), Validators.max(5)]], // de 1 à 5
        // tags: [[]] // tableau de chaînes de caractères
      }),
      medias: this.formBuilder.group({ /* … */ }),
      buddies: this.formBuilder.group({ /* … */ }),
    });
  }

  get infosGroup(): FormGroup {
    return this.addDiveForm.get('infos') as FormGroup;
  }
  get mediasGroup(): FormGroup {
    return this.addDiveForm.get('medias') as FormGroup;
  }
  get buddiesGroup(): FormGroup {
    return this.addDiveForm.get('buddies') as FormGroup;
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

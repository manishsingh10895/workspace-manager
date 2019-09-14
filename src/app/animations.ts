import { trigger, transition, style, query, animateChild, group, animate, stagger, keyframes } from '@angular/animations';

export const slideAnimations =
    //trigger register the animation, use this name in html
    trigger('slide', [
        // Creates a transition based in the string entered
        // * -> *, will animate on any value change
        // 
        transition('* => *', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ left: '-100%' })
            ], { optional: true }),
            // 
            query(':leave @*', animateChild(), { optional: true }),
            //Group run the animations in parallel
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' })),

                ], { optional: true })
            ]),
            // @* will query all child animations and run them 
            query(':enter @*', animateChild(), { optional: true }),
            // query('@*', animateChild())
        ])
    ])

export const pageAnimations = [
    trigger('pageAnimations', [
        transition(':enter', [
            query('.ui.container', [
                style({ opacity: 0, transform: 'translateY(-100px)' }),
                stagger(-30, [
                    animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
                ])
            ])
        ])
    ]),
]

export const growShrink = [
    trigger('growShrink', [
        transition('void => *', [
            query('*', [
                style({ transform: 'scale(0)' }),
                animate('0.1s ease-in', style({ transform: 'scale(1)' })),
            ]),
            transition('* => void', [
                query('*', [
                    style({ transform: 'scale(0)' }),
                    animate('0.1s ease-in', style({ transform: 'scale(1)' })),
                ])
            ])
        ])
    ])
];

export const incomingStagger = [
    trigger('inStagger', [
        transition('* => *', [
            query(':enter', [
                style({ opacity: 0, transform: 'translateX(-100%)' }),
                stagger(50, [
                    animate('350ms cubic-bezier(0.35, 0, 0.25, 1)', style({
                        opacity: 1, transform: 'none'
                    })),
                ])
            ], { optional: true }),
            query(':leave', [
                style({ opacity: 1, transform: '*' }),
                stagger(50, [
                    animate('300ms ease-out', style({
                        opacity: 0,
                        transform: 'translateX(100%)'
                    }))
                ])
            ], { optional: true })
        ])
    ])
]
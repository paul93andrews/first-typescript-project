import { Component } from './base-component.js';
import { ValidatorConfig, validate } from '../util/validation.js';
import { Autobind as Autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';

// ProjectInput Class 
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElementField: HTMLInputElement;
    descriptionInputElementField: HTMLInputElement;
    peopleInputElementField: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input')

        this.titleInputElementField = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElementField = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElementField = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent() { };

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElementField.value;
        const enteredDescription = this.descriptionInputElementField.value;
        const enteredPeople = this.peopleInputElementField.value;

        const titleValidation: ValidatorConfig = {
            value: enteredTitle,
            required: true,
        }

        const descriptionValidation: ValidatorConfig = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        }

        const peopleValidation: ValidatorConfig = {
            value: +enteredPeople,
            required: true,
            min: 0,
            max: 12
        }

        if (
            !validate(titleValidation) ||
            !validate(descriptionValidation) ||
            !validate(peopleValidation)
        ) {
            alert('invalid input, try again')
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();

        const userInput = this.gatherUserInput();

        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;

            projectState.addProject(title, description, people);

            this.clearInputs();
        }
    }

    private clearInputs() {
        this.titleInputElementField.value = '';
        this.descriptionInputElementField.value = '';
        this.peopleInputElementField.value = '';
    }
}
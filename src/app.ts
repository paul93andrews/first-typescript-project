// Code goes here!
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

interface ValidatorConfig {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validateInput: ValidatorConfig) {
    let isValid = true;
    if (validateInput.required) {
        isValid = isValid ?? validateInput.value.toString().trim().length !== 0;
    }
    if (validateInput.minLength != null && validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length > validateInput.minLength;
    }
    if (validateInput.maxLength != null && validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length < validateInput.maxLength;
    }
    if (validateInput.min != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value > validateInput.min;
    }
    if (validateInput.max != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value < validateInput.max;
    }
    return isValid;
}

// ProjectList Class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedHTMLContent = document.importNode(this.templateElement.content, true);
        this.element = importedHTMLContent.firstElementChild as HTMLElement;

        this.element.id = `${this.type}-projects`;

        this.attach();
        this.renderContent();
    }

    private renderContent() {
        const listID = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listID;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}

// ProjectInput Class 
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElementField: HTMLInputElement;
    descriptionInputElementField: HTMLInputElement;
    peopleInputElementField: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedHTMLContent = document.importNode(this.templateElement.content, true);
        this.element = importedHTMLContent.firstElementChild as HTMLFormElement;

        this.element.id = 'user-input';

        this.titleInputElementField = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElementField = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElementField = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

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
            min: 1,
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
            console.log(title, description, people);

            this.clearInputs();
        }
    }

    private clearInputs() {
        this.titleInputElementField.value = '';
        this.descriptionInputElementField.value = '';
        this.peopleInputElementField.value = '';

    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }

    
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');

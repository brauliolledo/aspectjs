---
home: true
heroText: '@AspectJS'
heroImage: /aspectjs.png
tagline: The AOP framework for Javascript and Typescript
actionText: Get Started →
actionLink: 01.guide/
features:
    - title: Modern
      details: Leverages <a href="https://github.com/tc39/proposal-decorators"><b>ES8 decorators stage 1</b></a> to bring aspect-oriented programming to your Javascript and Typescript code.
    - title: Easy to use
      details: Create & use aspects with some simple annotations, and save dozen lines of code!
    - title: Based on standards
      details: AspectJS is inspired by <a href="https://www.eclipse.org/aspectj/">AspectJ</a>  API, the standard for java-based AOP frameworks.
footer: MIT Licensed
---

![ci-status]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

### Installation:

<code-group>
<code-block title="YARN" active>

```bash
yarn add @aspectjs/core
```

</code-block>
<code-block title="NPM">

```bash
npm install @aspectjs/core
```

</code-block>
</code-group>

### Create an annotation

<code-group>
<code-block title="Javascript" active>

```js
// deprecated.annotation.js
import { AnnotationFactory } from '@aspectjs/common';

// Define the annotation
export const Deprecated = new AnnotationFactory('my-lib').create(function Deprecated(message) {});
```

</code-block>
<code-block title="Typescript">

```typescript
// deprecated.annotation.ts
import { AnnotationFactory } from '@aspectjs/common';

// Define the annotation
const Deprecated = new AnnotationFactory('my-lib').create(function Deprecated(message?: string): any {
    // Annotation stub returns any, so typescript accepts the annotation
    // above both classes, properties, methods & parameters
    return;
});
```

</code-block>
</code-group>

### Create an aspect

<code-group>
<code-block title="Javascript" active>

```js
import { on, AnnotationType } from '@aspectjs/common';
import { Aspect, Before, Order } from '@aspectjs/core/annotations';

import { Deprecated } from './deprecated.annotation';

// Create an aspect to enhance the @Deprecated annotation
@Aspect()
class DeprecatedAspect {
    @Before(on.method.withAnnotations(Deprecated)) // before @Deprecated methods
    @Before(on.parameter.withAnnotations(Deprecated)) // before methods with @Deprecated parameters
    @Order(1) // optional: give the execution order
    logWarning(context) {
        // context gets injected with some data relative to the current advice
        // get the unique target reference (ie: where the annotation is)
        const targetRef = context.target.ref;

        // if log warning not already raised for this target
        if (!this.tags[targetRef]) {
            if (
                // log any deprecated method call
                context.target.type === AnnotationType.METHOD ||
                // log any method call with a non-undefined deprecated parameter
                context.args[context.target.parameterIndex] !== undefined
            ) {
                // get the message provided to @Deprecated, if any
                const message = context.annotations.onSelf(Deprecated)[0].args[0];
                // log a warning with either the provided message or a default one
                console.warn(message ?? `${context.target.label} is deprecated`);
                // warning raised, don't produce further warnings for this target
                this.tags[context.target.ref] = true;
            }
        }
    }
}
```

</code-block>
<code-block title="Typescript">

```typescript
import { BeforeContext, on, AnnotationType } from '@aspectjs/common';
import { Aspect, Before, Order } from '@aspectjs/core/annotations';

import { Deprecated } from './deprecated.annotation';

// Define the annotation
const Deprecated = new AnnotationFactory('my-lib').create(function Deprecated(message?: string): any {
    // Annotation stub returns any, so typescript accepts the annotation
    // above both classes, properties, methods & parameters
    return;
});

// Create an aspect to enhance the @Deprecated annotation
@Aspect()
class DeprecatedAspect {
    private tags: Record<string, boolean> = {};

    @Before(on.method.withAnnotations(Deprecated)) // before @Deprecated methods
    @Before(on.parameter.withAnnotations(Deprecated)) // before methods with @Deprecated parameters
    @Order(1) // optional: give the execution order
    logWarning(context: BeforeContext) {
        // context gets injected with some data relative to the current advice
        // get the unique target reference (ie: where the annotation is)
        const targetRef = context.target.ref;
        // if log warning not already raised for this target
        if (!this.tags[targetRef]) {
            if (
                // log any deprecated method call
                context.target.type === AnnotationType.METHOD ||
                // log any method call with a non-undefined deprecated parameter.
                context.args[context.target.parameterIndex] !== undefined
            ) {
                // get the message provided to @Deprecated, if any
                const message = context.annotations.onSelf(Deprecated)[0].args[0];
                // log a warning with either the provided message or a default one
                console.warn(message ?? `${context.target.label} is deprecated`);
                // warning raised, don't produce further warnings for this target
                this.tags[context.target.ref] = true;
            }
        }
    }
}
```

</code-block>
</code-group>

### Use an existing aspect

<code-group>
<code-block title="Javascript" active>

```js
import { WEAVER } from '@aspectjs/core';
import { DeprcatedAspect } from './deprecated.aspect';
import { Deprecated } from './deprecated.annotation';

// Enable DeprecatedAspect
WEAVER.enable(new DeprecatedAspect());

class Greetings {
    sayHello(@Deprecarted('parameter name is deprecated') name) {
        console.log('Hello world');
    }
    @Deprecated()
    sayGoodbye() {
        console.log('Goodbye world');
    }
}

const g = new Greetings();
g.sayHello('WORLD'); // will raise one warning
g.sayGoodbye(); // will raise one warning
```

</code-block>
<code-block title="Typescript">

```typescript
import { WEAVER } from '@aspectjs/core';
import { DeprcatedAspect } from './deprecated.aspect';
import { Deprecated } from './deprecated.annotation';

// Enable DeprecatedAspect
WEAVER.enable(new DeprecatedAspect());

// Use the aspect
class Greetings {
    sayHello(@Deprecarted('parameter name is deprecated') name: string) {
        console.log('Hello world');
    }
    @Deprecated()
    sayGoodbye() {
        console.log('Goodbye world');
    }
}

const g = new Greetings();
g.sayHello('WORLD'); // will raise one warning
g.sayGoodbye(); // will raise one warning
```

</code-block>
</code-group>

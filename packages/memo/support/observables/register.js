import { ObservableMemoSupportAspect } from '@aspectjs/memo/support/observables';
import { WEAVER } from '@aspectjs/core';

WEAVER.enable(new ObservableMemoSupportAspect());

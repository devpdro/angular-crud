import 'zone.js/node';
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';

import { App } from 'src/app/app';
import { config } from 'src/app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;

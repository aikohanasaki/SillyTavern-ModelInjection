import { eventSource, event_types } from '../../../script.js';
import { executeSlashCommandsWithOptions } from '../../slash-commands.js';

/**
 * Keep a hidden, scan-only model tag injected and refresh it on EVERY generation.
 * Uses a stable id to avoid stacking.
 */
export async function refreshModelTagInjection() {
    const pipeline = '/model | /pass MODEL={{pipe}} | /inject id=STMI-model-tag position=none scan=true';
    try {
        await executeSlashCommandsWithOptions(pipeline, {
            handleParserErrors: false,
            handleExecutionErrors: false,
            scope: null,
            parserFlags: null,
            abortController: null,
        });
    } catch (error) {
        console.debug('[STMI] refreshModelTagInjection failed', error);
    }
}

// Seed once on app ready
eventSource.once(event_types.APP_READY, () => {
    refreshModelTagInjection();
});

// Refresh on EVERY generation (pre-prompt assembly)
eventSource.makeFirst(event_types.GENERATION_STARTED, async () => {
    await refreshModelTagInjection();
});
// source: https://github.com/npm/validate-npm-package-name/blob/main/index.js
import { builtinModules as builtins } from 'module';

const scopedPackagePattern: RegExp = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$');
const blacklist: readonly string[] = [
  'node_modules',
  'favicon.ico',
] as const;

interface NpmValidationResult {
  validForNewPackages: boolean;
  validForOldPackages: boolean;
  warnings?: string[];
  errors?: string[];
}

const validateNpmName = (name: unknown): NpmValidationResult => {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (name === null) {
    errors.push('name cannot be null');
    return done(warnings, errors);
  }

  if (name === undefined) {
    errors.push('name cannot be undefined');
    return done(warnings, errors);
  }

  if (typeof name !== 'string') {
    errors.push('name must be a string');
    return done(warnings, errors);
  }

  if (!name.length) {
    errors.push('name length must be greater than zero');
  }

  if (name.match(/^\./)) {
    errors.push('name cannot start with a period');
  }

  if (name.match(/^_/)) {
    errors.push('name cannot start with an underscore');
  }

  if (name.trim() !== name) {
    errors.push('name cannot contain leading or trailing spaces');
  }

  // No funny business
  blacklist.forEach((blacklistedName) => {
    if (name.toLowerCase() === blacklistedName) {
      errors.push(`${blacklistedName} is a blacklisted name`);
    }
  });

  // Generate warnings for stuff that used to be allowed
  // core module names like http, events, util, etc
  if (builtins.includes(name.toLowerCase())) {
    warnings.push(`${name} is a core module name`);
  }

  if (name.length > 214) {
    warnings.push('name can no longer contain more than 214 characters');
  }

  // mIxeD CaSe nAMEs
  if (name.toLowerCase() !== name) {
    warnings.push('name can no longer contain capital letters');
  }

  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    warnings.push('name can no longer contain special characters ("~\'!()*")');
  }

  if (encodeURIComponent(name) !== name) {
    // Maybe it's a scoped package name, like @user/package
    const nameMatch = name.match(scopedPackagePattern);
    if (nameMatch) {
      const [, user, pkg] = nameMatch;
      if (user && pkg && encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return done(warnings, errors);
      }
    }
    errors.push('name can only contain URL-friendly characters');
  }

  return done(warnings, errors);
};

const done = (warnings: string[], errors: string[]): NpmValidationResult => {
  const result: NpmValidationResult = {
    validForNewPackages: errors.length === 0 && warnings.length === 0,
    validForOldPackages: errors.length === 0,
    warnings,
    errors,
  };

  if (!result.warnings?.length) {
    delete result.warnings;
  }

  if (!result.errors?.length) {
    delete result.errors;
  }

  return result;
};

type ValidationResult = 
| {
    valid: true
  }
| {
    valid: false
    errors: string[]
  }

export const validateProjectName = (name: unknown): ValidationResult => {
  const nameValidation = validateNpmName(name)
  if (nameValidation.validForNewPackages) {
    return { valid: true }
  }

  return {
    valid: false,
    errors: [
      ...(nameValidation.errors || []),
      ...(nameValidation.warnings || []),
    ],
  }
}


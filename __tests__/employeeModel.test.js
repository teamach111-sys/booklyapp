import {
  EMPTY_EMPLOYEE_FORM,
  buildEmployeeCreateBody,
  buildEmployeeUpdateBody,
  employeeToForm,
  normalizeEmployee,
  parseEmployeeResponse,
  resolveSite,
  validateEmployeeForm,
} from '../src/screens/client/components/employeeModel';

const ACTIVE = {
  employee_id: 31,
  status: 'active',
  created_at: '2026-10-27T09:00:00Z',
  user_id: 52,
  firstname: 'Karim',
  name: 'Haddad',
  email: 'karim@bookly.fr',
  phone: '0699887766',
  profile_photo_url: 'assets/photos/1_52_ab.jpg',
};

const BLOCKED = {
  employee_id: 32,
  status: 'blocked',
  user_id: 53,
  firstname: 'Lina',
  name: 'Moreau',
  email: 'lina@bookly.fr',
  phone: null,
  profile_photo_url: null,
};

describe('normalizeEmployee', () => {
  it('maps an active employee', () => {
    const employee = normalizeEmployee(ACTIVE);

    expect(employee.id).toBe(31);
    expect(employee.fullName).toBe('Karim Haddad');
    expect(employee.initials).toBe('KH');
    expect(employee.isBlocked).toBe(false);
    expect(employee.statusLabel).toBe('ACTIF');
    expect(employee.nextStatus).toBe('blocked');
    expect(employee.photoUrl).toBe('assets/photos/1_52_ab.jpg');
  });

  it('maps a blocked employee and its next action', () => {
    const employee = normalizeEmployee(BLOCKED);

    expect(employee.isBlocked).toBe(true);
    expect(employee.statusLabel).toBe('BANNI');
    expect(employee.nextStatus).toBe('active');
    expect(employee.phone).toBe('');
    expect(employee.photoUrl).toBeNull();
  });

  it('copes with a missing name', () => {
    const employee = normalizeEmployee({ employee_id: 1 });

    expect(employee.fullName).toBe('Employé');
    expect(employee.initials).toBe('EM');
    expect(employee.email).toBe('');
  });
});

describe('parseEmployeeResponse', () => {
  it('reads the list and the capacity numbers', () => {
    const parsed = parseEmployeeResponse({
      employees: [ACTIVE, BLOCKED],
      count: 2,
      max_per_site: 3,
      slots_left: 1,
    });

    expect(parsed.employees).toHaveLength(2);
    expect(parsed.max).toBe(3);
    expect(parsed.count).toBe(2);
    expect(parsed.slotsLeft).toBe(1);
  });

  it('falls back when the envelope is incomplete', () => {
    const parsed = parseEmployeeResponse({ employees: [ACTIVE] });

    expect(parsed.max).toBe(3);
    expect(parsed.count).toBe(1);
    expect(parsed.slotsLeft).toBe(2);
  });

  it('tolerates a null response', () => {
    const parsed = parseEmployeeResponse(null);

    expect(parsed.employees).toEqual([]);
    expect(parsed.slotsLeft).toBe(3);
  });
});

describe('request bodies', () => {
  const form = {
    firstname: ' Karim ',
    name: ' Haddad ',
    email: ' KARIM@Bookly.FR ',
    phone: ' 0699887766 ',
    password: 'secret123',
    passwordConfirmation: 'secret123',
  };

  it('sends the password only when creating', () => {
    expect(buildEmployeeCreateBody(form)).toEqual({
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim@bookly.fr',
      phone: '0699887766',
      password: 'secret123',
      password_confirmation: 'secret123',
    });
  });

  it('omits the password when editing', () => {
    const body = buildEmployeeUpdateBody(form);

    expect(body).toEqual({
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim@bookly.fr',
      phone: '0699887766',
    });
    expect(body.password).toBeUndefined();
  });
});

describe('employeeToForm', () => {
  it('prefills from the employee', () => {
    expect(employeeToForm(normalizeEmployee(ACTIVE))).toEqual({
      firstname: 'Karim',
      name: 'Haddad',
      email: 'karim@bookly.fr',
      phone: '0699887766',
      password: '',
      passwordConfirmation: '',
    });
  });
});

describe('validateEmployeeForm', () => {
  it('requires names and email', () => {
    const errors = validateEmployeeForm(EMPTY_EMPLOYEE_FORM, true);

    expect(errors.firstname).toBeDefined();
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
  });

  it('does not ask for a password when editing', () => {
    const errors = validateEmployeeForm(
      { ...EMPTY_EMPLOYEE_FORM, firstname: 'A', name: 'B', email: 'a@b.fr' },
      false,
    );

    expect(errors).toEqual({});
  });

  it('enforces the password rules when creating', () => {
    const errors = validateEmployeeForm(
      {
        ...EMPTY_EMPLOYEE_FORM,
        firstname: 'A',
        name: 'B',
        email: 'a@b.fr',
        password: '12345',
        passwordConfirmation: '12345',
      },
      true,
    );

    expect(errors.password).toMatch(/6 caractères/);
  });

  it('flags a mismatched confirmation', () => {
    const errors = validateEmployeeForm(
      {
        ...EMPTY_EMPLOYEE_FORM,
        firstname: 'A',
        name: 'B',
        email: 'a@b.fr',
        password: 'secret123',
        passwordConfirmation: 'secret124',
      },
      true,
    );

    expect(errors.password_confirmation).toMatch(/ne correspondent pas/);
  });
});

describe('resolveSite', () => {
  const spaces = [
    { id: 7, space_name: 'Rivoli' },
    { id: 8, space_name: 'Oberkampf' },
  ];

  it('uses the preferred site when it belongs to the client', () => {
    expect(resolveSite(spaces, '8').space_name).toBe('Oberkampf');
    expect(resolveSite(spaces, 8).space_name).toBe('Oberkampf');
  });

  it('falls back to the first site', () => {
    expect(resolveSite(spaces, 999).space_name).toBe('Rivoli');
    expect(resolveSite(spaces, undefined).space_name).toBe('Rivoli');
  });

  it('returns null when the client has no site', () => {
    expect(resolveSite([], 7)).toBeNull();
    expect(resolveSite(null, 7)).toBeNull();
  });
});

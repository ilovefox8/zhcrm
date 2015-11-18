<?php
return array(
	'EmailTemplate' => array(
		0 => array(
			'name' => 'Case-to-Email auto-reply',
			'subject' => 'Case has been created',
			'body' => '<p>{Person.name},</p><p>Case \'{Case.name}\' has been created with number {Case.number} and assigned to {User.name}.</p>',
			'isHtml ' => '1',
		),
	),
	'ScheduledJob' => array(
		0 => array(
			'name' => 'Check Group Email Accounts',
			'job' => 'CheckInboundEmails',
			'status' => 'Active',
			'scheduling' => '*/4 * * * *',
		),
		1 => array(
			'name' => 'Check Personal Email Accounts',
			'job' => 'CheckEmailAccounts',
			'status' => 'Active',
			'scheduling' => '*/5 * * * *',
		),
		2 => array(
			'name' => 'Send Email Reminders',
			'job' => 'SendEmailReminders',
			'status' => 'Active',
			'scheduling' => '*/2 * * * *',
		),
		3 => array(
			'name' => 'Clean-up',
			'job' => 'Cleanup',
			'status' => 'Active',
			'scheduling' => '1 1 * * 0',
		),
		4 => array(
			'name' => 'Send Mass Emails',
			'job' => 'ProcessMassEmail',
			'status' => 'Active',
			'scheduling' => '0 1-5 * * *',
		),

	),
);
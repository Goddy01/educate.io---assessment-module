import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './auth/entities/user.entity';
import { Quiz, QuizStatus } from './quiz/entities/quiz.entity';
import { Question, QuestionType } from './question/entities/question.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Starting database seed...');

  // Get or create demo users
  const userRepo = dataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  // Teacher user
  let teacher = await userRepo.findOne({ where: { email: 'teacher@demo.com' } });
  if (!teacher) {
    teacher = userRepo.create({
      email: 'teacher@demo.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Williams',
      role: 'instructor',
    });
    teacher = await userRepo.save(teacher);
    console.log('✅ Created teacher user');
  } else {
    console.log('✅ Teacher user already exists');
  }

  // Student user
  let student = await userRepo.findOne({ where: { email: 'student@demo.com' } });
  if (!student) {
    student = userRepo.create({
      email: 'student@demo.com',
      password: hashedPassword,
      firstName: 'Alex',
      lastName: 'Johnson',
      role: 'student',
    });
    student = await userRepo.save(student);
    console.log('✅ Created student user');
  } else {
    console.log('✅ Student user already exists');
  }

  // Seed Quizzes
  const quizRepo = dataSource.getRepository(Quiz);
  const questionRepo = dataSource.getRepository(Question);

  // Clear existing quizzes and questions
  const existingQuizzes = await quizRepo.find();
  if (existingQuizzes.length > 0) {
    for (const quiz of existingQuizzes) {
      await questionRepo.delete({ quizId: quiz.id });
      await quizRepo.remove(quiz);
    }
    console.log(`🧹 Cleared ${existingQuizzes.length} existing quizzes`);
  }

  const sampleQuizzes = [
    {
      title: 'Agency Growth Fundamentals Assessment',
      description: 'Test your knowledge of building and scaling a digital agency. Covers client acquisition, team building, and profit optimization.',
      status: QuizStatus.PUBLISHED,
      enableNegativeMarking: false,
      showInstantFeedback: true,
      showInGradebook: true,
      timeLimit: 45,
      maxAttempts: 2,
      shuffleQuestions: false,
      questions: [
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What is the primary goal when building a digital agency?',
          options: JSON.stringify([
            'Maximize client count',
            'Build sustainable recurring revenue',
            'Focus only on high-ticket clients',
            'Minimize operational costs',
          ]),
          correctAnswers: JSON.stringify([1]),
          explanation: 'Building sustainable recurring revenue ensures long-term growth and stability for your agency.',
          points: 10,
          order: 0,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'Which client acquisition method typically has the highest conversion rate for agencies?',
          options: JSON.stringify([
            'Cold emailing',
            'Social media ads',
            'Referrals and testimonials',
            'Content marketing',
          ]),
          correctAnswers: JSON.stringify([2]),
          explanation: 'Referrals and testimonials have the highest conversion rate because they come with built-in trust.',
          points: 10,
          order: 1,
        },
        {
          type: QuestionType.TRUE_FALSE,
          prompt: 'Hiring employees should always be prioritized over hiring contractors when scaling an agency.',
          options: JSON.stringify(['True', 'False']),
          correctAnswers: JSON.stringify([1]),
          explanation: 'Contractors offer more flexibility and lower overhead costs, especially in early growth stages.',
          points: 10,
          order: 2,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What percentage of revenue should ideally go towards operational expenses in a profitable agency?',
          options: JSON.stringify([
            '30-40%',
            '50-60%',
            '70-80%',
            '90%+',
          ]),
          correctAnswers: JSON.stringify([0]),
          explanation: 'Keeping operational expenses at 30-40% ensures healthy profit margins and sustainable growth.',
          points: 10,
          order: 3,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'Which metric is most important for tracking agency health?',
          options: JSON.stringify([
            'Total revenue',
            'Monthly recurring revenue (MRR)',
            'Client count',
            'Profit margin',
          ]),
          correctAnswers: JSON.stringify([1]),
          explanation: 'Monthly recurring revenue (MRR) provides predictable income and is key for sustainable agency growth.',
          points: 10,
          order: 4,
        },
      ],
    },
    {
      title: 'Client Acquisition & Retention Strategies',
      description: 'Master the art of acquiring and retaining clients for long-term agency success.',
      status: QuizStatus.PUBLISHED,
      enableNegativeMarking: false,
      showInstantFeedback: true,
      showInGradebook: true,
      timeLimit: 30,
      maxAttempts: 2,
      shuffleQuestions: true,
      questions: [
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What is the most effective way to demonstrate value to potential clients?',
          options: JSON.stringify([
            'Lowest pricing',
            'Case studies with specific results',
            'Years of experience',
            'Team size',
          ]),
          correctAnswers: JSON.stringify([1]),
          explanation: 'Case studies with specific, measurable results prove your ability to deliver outcomes.',
          points: 10,
          order: 0,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'The best time to ask for a referral is:',
          options: JSON.stringify([
            'During onboarding',
            'After delivering exceptional results',
            'At contract renewal',
            'All of the above',
          ]),
          correctAnswers: JSON.stringify([3]),
          explanation: 'All of these moments are opportunities to ask for referrals when the client is happy.',
          points: 10,
          order: 1,
        },
        {
          type: QuestionType.TRUE_FALSE,
          prompt: 'It\'s better to focus on client retention than new client acquisition.',
          options: JSON.stringify(['True', 'False']),
          correctAnswers: JSON.stringify([0]),
          explanation: 'Retaining existing clients costs less and generates more revenue than constantly acquiring new ones.',
          points: 10,
          order: 2,
        },
      ],
    },
    {
      title: 'eCommerce Product Research & Validation',
      description: 'Learn how to identify profitable products and validate market demand before launching your store.',
      status: QuizStatus.PUBLISHED,
      enableNegativeMarking: false,
      showInstantFeedback: true,
      showInGradebook: true,
      timeLimit: 40,
      maxAttempts: 3,
      shuffleQuestions: false,
      questions: [
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What is the ideal profit margin for a successful eCommerce product?',
          options: JSON.stringify([
            '10-15%',
            '20-30%',
            '40-50%',
            '60%+',
          ]),
          correctAnswers: JSON.stringify([2]),
          explanation: 'A 40-50% profit margin provides enough room for marketing, operational costs, and sustainable growth.',
          points: 10,
          order: 0,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'Which tool is most effective for validating product demand?',
          options: JSON.stringify([
            'Google Trends',
            'Facebook Audience Insights',
            'Amazon Best Sellers',
            'All of the above',
          ]),
          correctAnswers: JSON.stringify([3]),
          explanation: 'Combining multiple validation tools gives a comprehensive view of market demand.',
          points: 10,
          order: 1,
        },
        {
          type: QuestionType.TRUE_FALSE,
          prompt: 'Products with high competition should always be avoided.',
          options: JSON.stringify(['True', 'False']),
          correctAnswers: JSON.stringify([1]),
          explanation: 'High competition often indicates a strong market. You can succeed with differentiation and better marketing.',
          points: 10,
          order: 2,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What is the minimum order quantity (MOQ) you should aim for when starting?',
          options: JSON.stringify([
            'As low as possible',
            '100-500 units',
            '1000+ units',
            'Depends on product and capital',
          ]),
          correctAnswers: JSON.stringify([3]),
          explanation: 'MOQ depends on your product type, capital, and risk tolerance. Start small, scale up.',
          points: 10,
          order: 3,
        },
      ],
    },
    {
      title: 'Marketing Funnels & Conversion Optimization',
      description: 'Understand how to build effective sales funnels that convert visitors into customers.',
      status: QuizStatus.PUBLISHED,
      enableNegativeMarking: true,
      showInstantFeedback: true,
      showInGradebook: true,
      timeLimit: 35,
      maxAttempts: 2,
      shuffleQuestions: true,
      questions: [
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What is the primary purpose of the top of a sales funnel?',
          options: JSON.stringify([
            'Make the sale',
            'Build trust and awareness',
            'Collect email addresses',
            'Show pricing',
          ]),
          correctAnswers: JSON.stringify([1]),
          explanation: 'The top of the funnel focuses on building awareness and establishing trust with potential customers.',
          points: 10,
          order: 0,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What is a typical conversion rate for a well-optimized landing page?',
          options: JSON.stringify([
            '1-2%',
            '5-10%',
            '15-20%',
            '25%+',
          ]),
          correctAnswers: JSON.stringify([1]),
          explanation: 'A 5-10% conversion rate is considered excellent for most industries and funnels.',
          points: 10,
          order: 1,
        },
        {
          type: QuestionType.TRUE_FALSE,
          prompt: 'A/B testing should be done continuously, not just once.',
          options: JSON.stringify(['True', 'False']),
          correctAnswers: JSON.stringify([0]),
          explanation: 'Continuous A/B testing helps you optimize your funnel over time and adapt to changing customer behavior.',
          points: 10,
          order: 2,
        },
      ],
    },
    {
      title: 'Copywriting & Personal Branding Essentials',
      description: 'Master persuasive copywriting and build your personal brand to attract clients and opportunities.',
      status: QuizStatus.PUBLISHED,
      enableNegativeMarking: false,
      showInstantFeedback: true,
      showInGradebook: true,
      timeLimit: 30,
      maxAttempts: 2,
      shuffleQuestions: false,
      questions: [
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What is the most important element of persuasive copywriting?',
          options: JSON.stringify([
            'Clever headlines',
            'Understanding your audience',
            'Using big words',
            'Long paragraphs',
          ]),
          correctAnswers: JSON.stringify([1]),
          explanation: 'Understanding your audience allows you to speak directly to their needs and pain points.',
          points: 10,
          order: 0,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'The AIDA formula stands for:',
          options: JSON.stringify([
            'Action, Interest, Desire, Attention',
            'Attention, Interest, Desire, Action',
            'Attraction, Intention, Demand, Achievement',
            'Awareness, Investment, Development, Acquisition',
          ]),
          correctAnswers: JSON.stringify([1]),
          explanation: 'AIDA: Attention (grab it), Interest (build it), Desire (create it), Action (get it).',
          points: 10,
          order: 1,
        },
        {
          type: QuestionType.TRUE_FALSE,
          prompt: 'Personal branding is only important for service-based businesses.',
          options: JSON.stringify(['True', 'False']),
          correctAnswers: JSON.stringify([1]),
          explanation: 'Personal branding is valuable for all business types as it builds trust and differentiates you from competitors.',
          points: 10,
          order: 2,
        },
      ],
    },
    {
      title: 'Sales Psychology & Closing Techniques',
      description: 'Understand buyer psychology and learn effective techniques to close more deals.',
      status: QuizStatus.DRAFT,
      enableNegativeMarking: false,
      showInstantFeedback: true,
      showInGradebook: true,
      timeLimit: 25,
      maxAttempts: 1,
      shuffleQuestions: false,
      questions: [
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'What is the most effective closing technique?',
          options: JSON.stringify([
            'Hard sell',
            'Assuming the sale',
            'Creating urgency',
            'Asking for the sale',
          ]),
          correctAnswers: JSON.stringify([3]),
          explanation: 'Simply asking for the sale is the most direct and effective approach when you\'ve built value.',
          points: 10,
          order: 0,
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: 'Objections are typically a sign of:',
          options: JSON.stringify([
            'Disinterest',
            'Lack of budget',
            'Missing information or trust',
            'Poor timing',
          ]),
          correctAnswers: JSON.stringify([2]),
          explanation: 'Most objections stem from lack of information or trust, which you can address with clarification.',
          points: 10,
          order: 1,
        },
      ],
    },
  ];

  for (const quizData of sampleQuizzes) {
    const { questions, ...quizFields } = quizData;
    const quiz = quizRepo.create({
      ...quizFields,
      createdById: teacher.id,
    });
    const savedQuiz = await quizRepo.save(quiz);

    // Create questions for this quiz
    for (const questionData of questions) {
      const question = questionRepo.create({
        ...questionData,
        quizId: savedQuiz.id,
      });
      await questionRepo.save(question);
    }

    console.log(`✅ Created quiz: "${quizData.title}" with ${questions.length} questions`);
  }

  console.log(`\n🎉 Successfully seeded ${sampleQuizzes.length} quizzes with questions!`);
  console.log('\n📊 Sample Data Summary:');
  console.log(`   - ${sampleQuizzes.length} Quizzes`);
  const totalQuestions = sampleQuizzes.reduce((sum, q) => sum + q.questions.length, 0);
  console.log(`   - ${totalQuestions} Questions`);
  console.log(`   - ${sampleQuizzes.filter(q => q.status === QuizStatus.PUBLISHED).length} Published Quizzes`);
  console.log(`   - ${sampleQuizzes.filter(q => q.status === QuizStatus.DRAFT).length} Draft Quizzes`);

  await app.close();
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});


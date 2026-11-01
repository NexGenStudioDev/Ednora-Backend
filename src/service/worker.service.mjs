import rabbitMQService from './rabbitmq.service.mjs';
import { createTransport } from '../utils/SendMail.js';
import envConstant from '../constant/env.constant.mjs';
import { generatePromotionEmail } from '../template/email/PromotionTemplate.mjs';
import { generateDemotionEmail } from '../template/email/DemotionTemplate.mjs';
import { generateNotificationEmail } from '../template/email/NotificationTemplate.mjs';

class NotificationWorker {
  constructor() {
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    console.log('🚀 Initializing RabbitMQ Notification & Email Worker Consumers...');

    // 1. Consume notifications_queue
    await rabbitMQService.consume('notifications_queue', async (rawMsg) => {
      await this.processMessage(rawMsg);
    });

    // 2. Consume email_queue
    await rabbitMQService.consume('email_queue', async (rawMsg) => {
      await this.processMessage(rawMsg);
    });

    console.log('✅ Notification & Email Workers active on notifications_queue & email_queue');
  }

  async processMessage(rawMsg) {
    try {
      const payload = rawMsg?.data || rawMsg?.payload || rawMsg;
      if (!payload) return;

      const type = payload.type || payload.event || (payload.notification ? 'CUSTOM_NOTIFICATION' : 'GENERIC');
      const email = payload.email || payload.studentEmail || payload.recipientEmail;

      if (!email) {
        console.warn('⚠️ [Worker] Message missing recipient email:', payload);
        return;
      }

      const transporter = createTransport();
      const sender = `"Eduvanta Academic Portal" <${envConstant.GMAIL_User || 'admissions@eduvanta.edu'}>`;

      let subject = 'Eduvanta Institutional Notification';
      let htmlContent = '';

      if (type === 'STUDENT_PROMOTION') {
        subject = `🎓 Congratulations! Promoted to Semester ${payload.currentSemester} - Eduvanta`;
        htmlContent = generatePromotionEmail({
          studentName: payload.studentName || 'Student',
          uniqueId: payload.studentId || payload.uniqueId || 'N/A',
          courseName: payload.courseName || 'Academic Program',
          previousSemester: payload.previousSemester || 1,
          currentSemester: payload.currentSemester || 2,
          date: payload.date || new Date().toLocaleDateString('en-US'),
        });
      } else if (type === 'STUDENT_DEMOTION') {
        subject = `⚠️ Academic Standing Notice: Term Adjusted to Semester ${payload.currentSemester} - Eduvanta`;
        htmlContent = generateDemotionEmail({
          studentName: payload.studentName || 'Student',
          uniqueId: payload.studentId || payload.uniqueId || 'N/A',
          courseName: payload.courseName || 'Academic Program',
          previousSemester: payload.previousSemester || 2,
          currentSemester: payload.currentSemester || 1,
          reason: payload.reason || 'Curriculum & Academic Standing Review',
          date: payload.date || new Date().toLocaleDateString('en-US'),
        });
      } else {
        // Custom or general notification
        const notifData = payload.notification || payload;
        subject = notifData.title ? `🔔 ${notifData.title} - Eduvanta` : 'Official Institutional Notification - Eduvanta';
        htmlContent = generateNotificationEmail({
          studentName: payload.studentName || 'Student',
          uniqueId: payload.studentId || payload.uniqueId || 'N/A',
          title: notifData.title || 'Official Announcement',
          message: notifData.message || 'You have received a new update from administration.',
          priority: notifData.priority || payload.priority || 'Normal',
          date: payload.date || new Date().toLocaleDateString('en-US'),
        });
      }

      const info = await transporter.sendMail({
        from: sender,
        to: email,
        subject,
        html: htmlContent,
      });

      console.log(`✉️ [Worker] Dispatched ${type} email to ${email} (MessageId: ${info?.messageId || 'OK'})`);
    } catch (error) {
      console.error('❌ [Worker] Error processing queued notification message:', error.message);
    }
  }
}

const notificationWorker = new NotificationWorker();
export default notificationWorker;


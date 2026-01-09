// Baby Sleep Tracker App
class BabySleepTracker {
    constructor() {
        this.currentBaby = null;
        this.babies = [];
        this.activities = [];
        this.sleepStartTime = null;
        this.sleepTimer = null;
        this.audioContext = null;
        this.currentSound = null;
        this.soundTimer = null;

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateUI();
        this.startRealtimeUpdates();
    }

    // Data Management
    loadData() {
        const savedData = localStorage.getItem('babySleepTrackerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.babies = data.babies || [];
            this.activities = data.activities || [];
            this.currentBaby = data.currentBaby || null;
        }

        // Create demo baby if no babies exist
        if (this.babies.length === 0) {
            this.createDemoBaby();
        }
    }

    saveData() {
        const data = {
            babies: this.babies,
            activities: this.activities,
            currentBaby: this.currentBaby
        };
        localStorage.setItem('babySleepTrackerData', JSON.stringify(data));
    }

    createDemoBaby() {
        const demoBaby = {
            id: Date.now(),
            name: 'Demo Baby',
            birthdate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 6 months old
        };
        this.babies.push(demoBaby);
        this.currentBaby = demoBaby.id;
        this.saveData();
    }

    getCurrentBaby() {
        return this.babies.find(b => b.id === this.currentBaby);
    }

    getBabyAge() {
        const baby = this.getCurrentBaby();
        if (!baby) return 0;

        const birthDate = new Date(baby.birthdate);
        const today = new Date();
        const months = (today.getFullYear() - birthDate.getFullYear()) * 12 +
                      (today.getMonth() - birthDate.getMonth());
        return months;
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });

        // Add Baby
        document.getElementById('addBabyBtn').addEventListener('click', () => {
            this.showModal('addBabyModal');
        });

        document.getElementById('addBabyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBaby();
        });

        // Baby Selection
        document.getElementById('babySelect').addEventListener('change', (e) => {
            this.currentBaby = parseInt(e.target.value);
            this.saveData();
            this.updateUI();
        });

        // Sleep Tracking
        document.getElementById('sleepBtn').addEventListener('click', () => {
            this.toggleSleep();
        });

        // Feeding
        document.getElementById('breastfeedingBtn').addEventListener('click', () => {
            this.showFeedingModal('breastfeeding');
        });

        document.getElementById('bottleBtn').addEventListener('click', () => {
            this.showFeedingModal('bottle');
        });

        document.getElementById('feedingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFeeding();
        });

        // Breastfeeding side selection
        document.querySelectorAll('[data-side]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('[data-side]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.getElementById('breastSide').value = e.currentTarget.dataset.side;
            });
        });

        // Diaper Tracking
        document.querySelectorAll('[data-diaper-type]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addDiaperChange(e.currentTarget.dataset.diaperType);
            });
        });

        // Notes
        document.getElementById('addNoteBtn').addEventListener('click', () => {
            this.addNote();
        });

        // Past Activity
        document.getElementById('addPastActivityBtn').addEventListener('click', () => {
            this.addPastActivity();
        });

        // Sounds
        document.querySelectorAll('.play-sound-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const soundCard = e.target.closest('.sound-card');
                const soundType = soundCard.dataset.sound;
                this.toggleSound(soundType, soundCard);
            });
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            const volume = e.target.value;
            document.getElementById('volumeValue').textContent = volume + '%';
            if (this.currentSound && this.currentSound.gainNode) {
                this.currentSound.gainNode.gain.value = volume / 100;
            }
        });

        document.getElementById('soundTimer').addEventListener('change', (e) => {
            this.setSoundTimer(parseInt(e.target.value));
        });

        // Schedule
        document.getElementById('updateScheduleBtn').addEventListener('click', () => {
            this.updateSchedule();
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal').id);
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // Navigation
    navigateTo(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        document.getElementById(page).classList.add('active');
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        if (page === 'schedule') {
            this.updateSchedule();
        }
    }

    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Baby Management
    addBaby() {
        const name = document.getElementById('babyName').value;
        const birthdate = document.getElementById('babyBirthdate').value;

        const baby = {
            id: Date.now(),
            name,
            birthdate
        };

        this.babies.push(baby);
        this.currentBaby = baby.id;
        this.saveData();
        this.updateUI();
        this.closeModal('addBabyModal');
        document.getElementById('addBabyForm').reset();
    }

    // Sleep Tracking
    toggleSleep() {
        if (this.sleepStartTime) {
            this.endSleep();
        } else {
            this.startSleep();
        }
    }

    startSleep() {
        this.sleepStartTime = Date.now();
        const btn = document.getElementById('sleepBtn');
        btn.classList.add('active');
        btn.querySelector('.btn-text').textContent = 'Schlaf beenden';
        document.getElementById('sleepTimer').style.display = 'block';

        this.sleepTimer = setInterval(() => {
            this.updateSleepTimer();
        }, 1000);
    }

    endSleep() {
        const duration = Math.floor((Date.now() - this.sleepStartTime) / 1000);

        this.addActivity({
            type: 'sleep',
            startTime: this.sleepStartTime,
            endTime: Date.now(),
            duration: duration
        });

        clearInterval(this.sleepTimer);
        this.sleepStartTime = null;

        const btn = document.getElementById('sleepBtn');
        btn.classList.remove('active');
        btn.querySelector('.btn-text').textContent = 'Schlaf starten';
        document.getElementById('sleepTimer').style.display = 'none';

        this.updateUI();
    }

    updateSleepTimer() {
        if (!this.sleepStartTime) return;

        const elapsed = Math.floor((Date.now() - this.sleepStartTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;

        document.getElementById('sleepDuration').textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Feeding
    showFeedingModal(type) {
        document.getElementById('feedingModalTitle').textContent =
            type === 'breastfeeding' ? 'Stillen tracken' : 'Flasche tracken';

        if (type === 'breastfeeding') {
            document.getElementById('breastfeedingFields').style.display = 'block';
            document.getElementById('bottleFields').style.display = 'none';
        } else {
            document.getElementById('breastfeedingFields').style.display = 'none';
            document.getElementById('bottleFields').style.display = 'block';
        }

        document.getElementById('feedingForm').dataset.feedingType = type;
        this.showModal('feedingModal');
    }

    saveFeeding() {
        const type = document.getElementById('feedingForm').dataset.feedingType;
        const duration = parseInt(document.getElementById('feedingDuration').value);
        const notes = document.getElementById('feedingNotes').value;

        const activity = {
            type: 'feeding',
            feedingType: type,
            duration: duration * 60,
            notes: notes,
            timestamp: Date.now()
        };

        if (type === 'breastfeeding') {
            activity.side = document.getElementById('breastSide').value;
        } else {
            activity.amount = parseInt(document.getElementById('bottleAmount').value);
        }

        this.addActivity(activity);
        this.closeModal('feedingModal');
        document.getElementById('feedingForm').reset();
        this.updateUI();
    }

    // Diaper Tracking
    addDiaperChange(type) {
        this.addActivity({
            type: 'diaper',
            diaperType: type,
            timestamp: Date.now()
        });
        this.updateUI();
        this.showSuccessNotification(`Windelwechsel (${this.getDiaperTypeText(type)}) gespeichert!`);
    }

    getDiaperTypeText(type) {
        const types = {
            'wet': 'Nass',
            'dirty': 'Stuhlgang',
            'both': 'Beides'
        };
        return types[type] || type;
    }

    // Notes
    addNote() {
        const note = document.getElementById('noteInput').value.trim();
        if (!note) return;

        this.addActivity({
            type: 'note',
            content: note,
            timestamp: Date.now()
        });

        document.getElementById('noteInput').value = '';
        this.updateUI();
        this.showSuccessNotification('Notiz gespeichert!');
    }

    // Past Activity
    addPastActivity() {
        const type = document.getElementById('pastActivityType').value;
        const time = document.getElementById('pastActivityTime').value;

        if (!time) return;

        const timestamp = new Date(time).getTime();

        this.addActivity({
            type: type,
            timestamp: timestamp,
            isPastEntry: true
        });

        document.getElementById('pastActivityTime').value = '';
        this.updateUI();
        this.showSuccessNotification('Vergangene Aktivität hinzugefügt!');
    }

    // Activity Management
    addActivity(activity) {
        if (!this.currentBaby) return;

        activity.babyId = this.currentBaby;
        if (!activity.timestamp) {
            activity.timestamp = Date.now();
        }

        this.activities.push(activity);
        this.saveData();
    }

    getTodayActivities() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.activities.filter(a =>
            a.babyId === this.currentBaby &&
            a.timestamp >= today.getTime()
        ).sort((a, b) => b.timestamp - a.timestamp);
    }

    // Sound Management
    async toggleSound(soundType, soundCard) {
        if (this.currentSound && this.currentSound.type === soundType) {
            this.stopSound();
            return;
        }

        if (this.currentSound) {
            this.stopSound();
        }

        await this.playSound(soundType, soundCard);
    }

    async playSound(soundType, soundCard) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const volume = document.getElementById('volumeSlider').value / 100;
        gainNode.gain.value = volume;

        this.currentSound = {
            type: soundType,
            oscillator: oscillator,
            gainNode: gainNode,
            card: soundCard
        };

        // Configure sound based on type
        this.configureSoundType(soundType, oscillator, gainNode);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start();

        // Update UI
        document.querySelectorAll('.sound-card').forEach(card => card.classList.remove('playing'));
        soundCard.classList.add('playing');
        soundCard.querySelector('.play-sound-btn').textContent = '⏸️ Stoppen';

        document.getElementById('nowPlaying').innerHTML =
            `<p class="playing-text">🎵 Spielt: ${this.getSoundName(soundType)}</p>`;

        // Set timer if configured
        const timerValue = parseInt(document.getElementById('soundTimer').value);
        if (timerValue > 0) {
            this.setSoundTimer(timerValue);
        }
    }

    configureSoundType(type, oscillator, gainNode) {
        switch(type) {
            case 'white-noise':
                this.createWhiteNoise(oscillator, gainNode);
                break;
            case 'pink-noise':
                this.createPinkNoise(oscillator, gainNode);
                break;
            case 'brown-noise':
                this.createBrownNoise(oscillator, gainNode);
                break;
            case 'rain':
                this.createRainSound(oscillator, gainNode);
                break;
            case 'ocean':
                this.createOceanSound(oscillator, gainNode);
                break;
            case 'heartbeat':
                this.createHeartbeat(oscillator, gainNode);
                break;
            case 'lullaby':
                this.createLullaby(oscillator, gainNode);
                break;
            case 'fan':
                this.createFanSound(oscillator, gainNode);
                break;
        }
    }

    createWhiteNoise(oscillator, gainNode) {
        // White noise using buffer
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        whiteNoise.connect(gainNode);
        whiteNoise.start();

        this.currentSound.source = whiteNoise;
        oscillator.stop();
    }

    createPinkNoise(oscillator, gainNode) {
        oscillator.type = 'sine';
        oscillator.frequency.value = 100;

        // Create filter for pink noise effect
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        oscillator.disconnect();
        oscillator.connect(filter);
        filter.connect(gainNode);
    }

    createBrownNoise(oscillator, gainNode) {
        oscillator.type = 'sine';
        oscillator.frequency.value = 50;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        oscillator.disconnect();
        oscillator.connect(filter);
        filter.connect(gainNode);
    }

    createRainSound(oscillator, gainNode) {
        // Simulate rain with multiple frequencies
        oscillator.type = 'sine';
        oscillator.frequency.value = 200 + Math.random() * 100;

        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.1;
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 50;

        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start();
    }

    createOceanSound(oscillator, gainNode) {
        oscillator.type = 'sine';
        oscillator.frequency.value = 80;

        // Create slow LFO for wave effect
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.2;
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 30;

        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start();

        this.currentSound.lfo = lfo;
    }

    createHeartbeat(oscillator, gainNode) {
        oscillator.type = 'sine';
        oscillator.frequency.value = 100;

        // Pulse effect
        const now = this.audioContext.currentTime;
        const beatInterval = 0.8; // seconds

        for (let i = 0; i < 10; i++) {
            const time = now + i * beatInterval;
            gainNode.gain.setValueAtTime(0.8, time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            gainNode.gain.setValueAtTime(0.5, time + 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        }
    }

    createLullaby(oscillator, gainNode) {
        oscillator.type = 'sine';

        // Simple lullaby melody (Twinkle Twinkle)
        const notes = [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00]; // C C G G A A G
        const noteDuration = 0.5;

        let currentNote = 0;
        const playNote = () => {
            oscillator.frequency.value = notes[currentNote % notes.length];
            currentNote++;
        };

        playNote();
        this.currentSound.noteInterval = setInterval(playNote, noteDuration * 1000);
    }

    createFanSound(oscillator, gainNode) {
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 120;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        oscillator.disconnect();
        oscillator.connect(filter);
        filter.connect(gainNode);
    }

    stopSound() {
        if (!this.currentSound) return;

        try {
            if (this.currentSound.oscillator) {
                this.currentSound.oscillator.stop();
            }
            if (this.currentSound.source) {
                this.currentSound.source.stop();
            }
            if (this.currentSound.lfo) {
                this.currentSound.lfo.stop();
            }
            if (this.currentSound.noteInterval) {
                clearInterval(this.currentSound.noteInterval);
            }
        } catch (e) {
            console.log('Error stopping sound:', e);
        }

        if (this.currentSound.card) {
            this.currentSound.card.classList.remove('playing');
            this.currentSound.card.querySelector('.play-sound-btn').textContent = '▶️ Abspielen';
        }

        document.getElementById('nowPlaying').innerHTML =
            '<p class="playing-text">Kein Sound spielt gerade</p>';

        this.currentSound = null;

        if (this.soundTimer) {
            clearTimeout(this.soundTimer);
            this.soundTimer = null;
        }
    }

    setSoundTimer(minutes) {
        if (this.soundTimer) {
            clearTimeout(this.soundTimer);
        }

        if (minutes > 0 && this.currentSound) {
            this.soundTimer = setTimeout(() => {
                this.stopSound();
            }, minutes * 60 * 1000);
        }
    }

    getSoundName(type) {
        const names = {
            'white-noise': 'Weißes Rauschen',
            'pink-noise': 'Rosa Rauschen',
            'brown-noise': 'Braunes Rauschen',
            'rain': 'Regen',
            'ocean': 'Ozean Wellen',
            'heartbeat': 'Herzschlag',
            'lullaby': 'Wiegenlied',
            'fan': 'Ventilator'
        };
        return names[type] || type;
    }

    // Schedule & Recommendations
    updateSchedule() {
        const age = document.getElementById('babyAge').value;
        const scheduleContent = document.getElementById('scheduleContent');
        const tipsList = document.getElementById('sleepTipsList');

        const recommendations = this.getScheduleRecommendations(parseInt(age));

        scheduleContent.innerHTML = `
            <div class="schedule-info">
                <h4>📊 Empfohlene tägliche Schlafzeit: ${recommendations.totalSleep}</h4>
                <p><strong>Anzahl Nickerchen:</strong> ${recommendations.naps}</p>
                <p><strong>Nachtschlaf:</strong> ${recommendations.nightSleep}</p>
                <p><strong>Empfohlene Wachzeit:</strong> ${recommendations.wakeTime}</p>
            </div>
            <div class="schedule-info">
                <h4>⏰ Beispiel-Tagesablauf</h4>
                ${recommendations.schedule}
            </div>
        `;

        tipsList.innerHTML = recommendations.tips.map(tip => `<li>${tip}</li>`).join('');
    }

    getScheduleRecommendations(ageMonths) {
        if (ageMonths <= 3) {
            return {
                totalSleep: '14-17 Stunden',
                naps: '4-5 Nickerchen',
                nightSleep: '8-9 Stunden',
                wakeTime: '45-60 Minuten',
                schedule: `
                    <p>7:00 - Aufwachen</p>
                    <p>8:00-9:30 - Nickerchen 1</p>
                    <p>11:00-12:30 - Nickerchen 2</p>
                    <p>14:00-15:30 - Nickerchen 3</p>
                    <p>17:00-18:00 - Nickerchen 4</p>
                    <p>19:30 - Bettzeit</p>
                `,
                tips: [
                    'Neugeborene schlafen 14-17 Stunden pro Tag',
                    'Schaffen Sie eine ruhige Schlafumgebung',
                    'Achten Sie auf Müdigkeitszeichen',
                    'Weißes Rauschen kann beruhigend wirken',
                    'Wickeln kann beim Einschlafen helfen'
                ]
            };
        } else if (ageMonths <= 6) {
            return {
                totalSleep: '12-15 Stunden',
                naps: '3-4 Nickerchen',
                nightSleep: '9-10 Stunden',
                wakeTime: '1,5-2 Stunden',
                schedule: `
                    <p>7:00 - Aufwachen</p>
                    <p>9:00-10:30 - Nickerchen 1</p>
                    <p>12:30-14:00 - Nickerchen 2</p>
                    <p>16:00-17:00 - Nickerchen 3</p>
                    <p>19:00 - Bettzeit</p>
                `,
                tips: [
                    'Babys in diesem Alter brauchen 12-15 Stunden Schlaf',
                    'Beginnen Sie mit einer Schlafroutine',
                    'Legen Sie das Baby schläfrig, aber wach hin',
                    'Konsistenz ist wichtig',
                    'Achten Sie auf die Wachzeitfenster'
                ]
            };
        } else if (ageMonths <= 9) {
            return {
                totalSleep: '12-14 Stunden',
                naps: '2-3 Nickerchen',
                nightSleep: '10-11 Stunden',
                wakeTime: '2-3 Stunden',
                schedule: `
                    <p>7:00 - Aufwachen</p>
                    <p>9:30-11:00 - Nickerchen 1</p>
                    <p>14:00-15:30 - Nickerchen 2</p>
                    <p>19:00 - Bettzeit</p>
                `,
                tips: [
                    'Reduzierung auf 2-3 Nickerchen ist normal',
                    'Etablieren Sie eine feste Schlafroutine',
                    'Vermeiden Sie Bildschirmzeit vor dem Schlaf',
                    'Dunkles Zimmer fördert besseren Schlaf',
                    'Schlafsack statt Decke verwenden'
                ]
            };
        } else {
            return {
                totalSleep: '11-14 Stunden',
                naps: '1-2 Nickerchen',
                nightSleep: '10-12 Stunden',
                wakeTime: '3-4 Stunden',
                schedule: `
                    <p>7:00 - Aufwachen</p>
                    <p>10:00-11:30 - Nickerchen 1</p>
                    <p>14:30-16:00 - Nickerchen 2</p>
                    <p>19:30 - Bettzeit</p>
                `,
                tips: [
                    'Ältere Babys brauchen weniger Nickerchen',
                    'Halten Sie feste Schlafenszeiten ein',
                    'Beruhigende Aktivitäten vor dem Schlaf',
                    'Kuscheltier kann Sicherheit geben',
                    'Geben Sie dem Baby Zeit, selbst einzuschlafen'
                ]
            };
        }
    }

    calculateNextSleepRecommendation() {
        const activities = this.getTodayActivities();
        const lastSleep = activities.find(a => a.type === 'sleep');

        if (!lastSleep) {
            return {
                time: 'Bald',
                reason: 'Noch keine Schlafdaten heute'
            };
        }

        const age = this.getBabyAge();
        let recommendedWakeTime = 2 * 60 * 60 * 1000; // 2 hours default

        if (age <= 3) {
            recommendedWakeTime = 60 * 60 * 1000; // 1 hour
        } else if (age <= 6) {
            recommendedWakeTime = 1.5 * 60 * 60 * 1000; // 1.5 hours
        } else if (age <= 9) {
            recommendedWakeTime = 2.5 * 60 * 60 * 1000; // 2.5 hours
        } else {
            recommendedWakeTime = 3 * 60 * 60 * 1000; // 3 hours
        }

        const wakeTime = lastSleep.endTime || lastSleep.timestamp;
        const nextSleepTime = wakeTime + recommendedWakeTime;
        const now = Date.now();

        if (nextSleepTime < now) {
            return {
                time: 'Jetzt!',
                reason: 'Die empfohlene Wachzeit ist bereits überschritten'
            };
        }

        const minutesUntil = Math.round((nextSleepTime - now) / 60000);
        const hours = Math.floor(minutesUntil / 60);
        const mins = minutesUntil % 60;

        let timeStr = '';
        if (hours > 0) {
            timeStr = `in ${hours}h ${mins}m`;
        } else {
            timeStr = `in ${mins} Minuten`;
        }

        return {
            time: timeStr,
            reason: `Basierend auf ${age} Monate altem Baby`
        };
    }

    getCurrentWakeTime() {
        const activities = this.getTodayActivities();
        const lastSleep = activities.find(a => a.type === 'sleep');

        if (!lastSleep) {
            return '0h 0m';
        }

        const wakeTime = lastSleep.endTime || lastSleep.timestamp;
        const elapsed = Date.now() - wakeTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);

        return `${hours}h ${minutes}m`;
    }

    getTotalSleepToday() {
        const activities = this.getTodayActivities();
        const sleeps = activities.filter(a => a.type === 'sleep' && a.duration);

        const totalSeconds = sleeps.reduce((sum, sleep) => sum + sleep.duration, 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${hours}h ${minutes}m`;
    }

    // UI Updates
    updateUI() {
        this.updateBabySelector();
        this.updateDashboard();
        this.updateTimeline();
    }

    updateBabySelector() {
        const select = document.getElementById('babySelect');
        select.innerHTML = '<option value="">Baby wählen...</option>';

        this.babies.forEach(baby => {
            const option = document.createElement('option');
            option.value = baby.id;
            option.textContent = baby.name;
            if (baby.id === this.currentBaby) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    updateDashboard() {
        const activities = this.getTodayActivities();

        // Total sleep
        document.getElementById('totalSleepToday').textContent = this.getTotalSleepToday();

        // Current wake time
        document.getElementById('currentWakeTime').textContent = this.getCurrentWakeTime();

        // Feedings count
        const feedings = activities.filter(a => a.type === 'feeding').length;
        document.getElementById('feedingsToday').textContent = feedings;

        // Diapers count
        const diapers = activities.filter(a => a.type === 'diaper').length;
        document.getElementById('diapersToday').textContent = diapers;

        // Next sleep recommendation
        const recommendation = this.calculateNextSleepRecommendation();
        document.getElementById('nextSleepTime').textContent = recommendation.time;
        document.getElementById('recommendationReason').textContent = recommendation.reason;
    }

    updateTimeline() {
        const timeline = document.getElementById('todayTimeline');
        const activities = this.getTodayActivities();

        if (activities.length === 0) {
            timeline.innerHTML = '<div class="timeline-empty">Noch keine Aktivitäten heute</div>';
            return;
        }

        timeline.innerHTML = activities.map(activity => {
            const time = new Date(activity.timestamp).toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="timeline-item">
                    <div class="timeline-icon">${this.getActivityIcon(activity)}</div>
                    <div class="timeline-content">
                        <div class="timeline-time">${time}</div>
                        <div class="timeline-description">${this.getActivityDescription(activity)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getActivityIcon(activity) {
        const icons = {
            'sleep': '😴',
            'feeding': '🍼',
            'diaper': '🧷',
            'note': '📝'
        };
        return icons[activity.type] || '📌';
    }

    getActivityDescription(activity) {
        switch(activity.type) {
            case 'sleep':
                if (activity.duration) {
                    const hours = Math.floor(activity.duration / 3600);
                    const minutes = Math.floor((activity.duration % 3600) / 60);
                    return `Schlaf: ${hours}h ${minutes}m`;
                }
                return 'Schlaf';

            case 'feeding':
                if (activity.feedingType === 'breastfeeding') {
                    return `Stillen (${activity.side || 'beide'} Seite)`;
                } else {
                    return `Flasche: ${activity.amount || '?'}ml`;
                }

            case 'diaper':
                return `Windel: ${this.getDiaperTypeText(activity.diaperType)}`;

            case 'note':
                return `Notiz: ${activity.content}`;

            default:
                return activity.type;
        }
    }

    startRealtimeUpdates() {
        setInterval(() => {
            if (document.querySelector('.page.active').id === 'dashboard') {
                this.updateDashboard();
            }
        }, 30000); // Update every 30 seconds
    }

    showSuccessNotification(message) {
        // You can implement a toast notification here
        console.log('Success:', message);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.babyApp = new BabySleepTracker();
});
